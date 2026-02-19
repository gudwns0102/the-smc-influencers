import { supabase } from "../lib/supabase";
import { apify_client } from "../lib/apify";
import { filterNull } from "../utils/helpers";
import type { ReelData } from "../types";
import { logger } from "../utils/logger";
import _ from "lodash";

const TASK_NAME = "Instagram Contents";

export async function fillInstagramContents() {
  logger.divider();
  logger.info(TASK_NAME, "Starting task...");
  const result = await supabase
    .from("influencers")
    .select(
      `
      id,
      handle,
      platform,
      contents(
        id,
        created_at
      )
      `,
    )
    .eq("platform", "instagram")
    .is("platform_error", null)
    .is("contents", null)
    .limit(100); // Github actions throwed when limit is too big

  const influencers = result.data || [];

  if (influencers.length === 0) {
    logger.info(TASK_NAME, "No influencers found needing content update.");
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

  const upsert_payload = contentItems
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

  const valid_influencers_id = _.uniq(
    upsert_payload.map((ci) => ci.influencer_id),
  );

  const no_content_influencers_id = influencers
    .filter((i) => !valid_influencers_id.includes(i.id))
    .map((i) => i.id);

  logger.info(
    TASK_NAME,
    `no_content_influencers_id: ${no_content_influencers_id.length}`,
  );

  const influencer_update_result = await supabase
    .from("influencers")
    .update({ platform_error: "no_contents" })
    .in("id", no_content_influencers_id);

  if (influencer_update_result.error) {
    logger.error(
      TASK_NAME,
      "Failed to update influencers to Supabase",
      influencer_update_result.error,
    );
    return;
  }

  const upsert_result = await supabase.from("contents").upsert(upsert_payload);

  if (upsert_result.error) {
    logger.error(
      TASK_NAME,
      "Failed to upsert contents to Supabase",
      upsert_result.error,
    );
    return;
  }

  logger.success(
    TASK_NAME,
    `Successfully upserted ${upsert_payload.length} content items.`,
  );
}
