import { supabase } from "../lib/supabase";
import { apify_client } from "../lib/apify";
import { filterNull } from "../utils/helpers";
import type { ReelData } from "../types";
import { logger } from "../utils/logger";
import type { Database } from "../lib/database.types";

const TASK_NAME = "Instagram Contents";

export async function fillInstagramContents(
  influencers: Pick<
    Database["public"]["Tables"]["influencers"]["Row"] & {
      platform: "instagram";
    },
    "id" | "handle" | "platform"
  >[],
) {
  logger.divider();
  logger.info(TASK_NAME, "Starting task...");

  if (influencers.length === 0) {
    logger.info(TASK_NAME, "No influencers provided needing content update.");
    return;
  }

  logger.info(
    TASK_NAME,
    `Found ${influencers.length} influencers: ${influencers.map((i) => i.handle).join(", ")}`,
  );

  const run = await apify_client.actor("apify/instagram-reel-scraper").call(
    {
      username: influencers.map((i) => i.handle),
      resultsLimit: 15,
    },
    {
      log: null,
    },
  );

  logger.info(TASK_NAME, "Scraper started, fetching reel items...");

  const { items: contentItems } = await apify_client
    .dataset<ReelData | { error: string }>(run.defaultDatasetId)
    .listItems();

  logger.info(
    TASK_NAME,
    `Fetched ${contentItems.length} reel items from Apify.`,
  );

  const contentsToUpsert = contentItems
    .map((content) => {
      if ("error" in content) {
        return null;
      }

      const content_handle = content.inputUrl.split("/").pop();

      if (!content_handle) {
        return null;
      }

      const owner = influencers.find((i) => i.handle === content_handle);

      if (!owner) {
        return null;
      }

      if (!content.videoPlayCount) {
        return null;
      }

      if (!content.timestamp) {
        return null;
      }

      try {
        new Date(content.timestamp);
      } catch (error) {
        logger.error(TASK_NAME, "Invalid timestamp", error);
        return null;
      }

      return {
        influencer_id: owner.id,
        published_at: new Date(content.timestamp).toISOString(),
        view_count: content.videoPlayCount,
        is_ad:
          content.caption.includes("#광고") ||
          content.caption.toLowerCase().includes("#ad"),
      };
    })
    .filter(filterNull);

  const validInfluencerIds = Array.from(
    new Set(contentsToUpsert.map((ci) => ci.influencer_id)),
  );

  const influencersWithNoContentsIds = influencers
    .filter((i) => !validInfluencerIds.includes(i.id))
    .map((i) => i.id);

  logger.info(
    TASK_NAME,
    `influencersWithNoContentsIds: ${influencersWithNoContentsIds.length}`,
  );

  const influencerUpdateResult = await supabase
    .from("influencers")
    .update({ platform_error: "no_contents" })
    .in("id", influencersWithNoContentsIds);

  if (influencerUpdateResult.error) {
    logger.error(
      TASK_NAME,
      "Failed to update influencers to Supabase",
      influencerUpdateResult.error,
    );
    return;
  }

  if (validInfluencerIds.length > 0) {
    const { error: deleteError } = await supabase
      .from("contents")
      .delete()
      .in("influencer_id", validInfluencerIds);

    if (deleteError) {
      logger.error(
        TASK_NAME,
        "Failed to delete old contents from Supabase",
        deleteError,
      );
      return;
    }
  }

  if (contentsToUpsert.length === 0) {
    logger.info(TASK_NAME, "No structured contents extracted to upsert.");
    return;
  }

  const upsertResult = await supabase.from("contents").upsert(contentsToUpsert);

  if (upsertResult.error) {
    logger.error(
      TASK_NAME,
      "Failed to upsert contents to Supabase",
      upsertResult.error,
    );
    return;
  }

  logger.success(
    TASK_NAME,
    `Successfully upserted ${contentsToUpsert.length} content items.`,
  );
}
