import type { Database } from "../lib/database.types";
import { supabase } from "../lib/supabase";
import { youtube_client } from "../lib/youtube";
import { logger } from "../utils/logger";

const TASK_NAME = "YouTube Contents";

export async function fillYoutubeContents(
  influencers: Pick<
    Database["public"]["Tables"]["influencers"]["Row"] & {
      platform: "youtube";
    },
    "id" | "handle" | "platform"
  >[],
) {
  logger.divider();
  logger.info(TASK_NAME, "Starting task...");
  try {
    if (influencers.length === 0) {
      logger.info(TASK_NAME, "No influencers provided needing content update.");
      return;
    }

    logger.info(
      TASK_NAME,
      `Found ${influencers.length} influencers: ${influencers.map((i) => i.handle).join(", ")}`,
    );

    const contentsToUpsert: {
      influencer_id: string;
      published_at: string;
      view_count: number;
      is_ad: boolean;
    }[] = [];

    const influencerErrors: Array<Database["public"]["Tables"]["influencers"]["Insert"]> =
      [];

    for (const influencer of influencers) {
      try {
        logger.info(TASK_NAME, `Fetching content for ${influencer.handle}...`);

        // 1. Get channel upload playlist ID
        const channels = await youtube_client.channels.list({
          forHandle: influencer.handle,
          part: ["contentDetails"],
        });

        const channelItem = channels.data.items?.[0];
        const playlistId =
          channelItem?.contentDetails?.relatedPlaylists?.uploads;

        if (!playlistId) {
          logger.error(
            TASK_NAME,
            `Uploads playlist not found for ${influencer.handle}`,
          );

          influencerErrors.push({
            id: influencer.id,
            handle: influencer.handle,
            platform: influencer.platform,
            platform_error: "Uploads playlist not found",
          });

          continue;
        }

        // 2. Get latest videos from the playlist
        const playlistItems = await youtube_client.playlistItems.list({
          playlistId: playlistId,
          part: ["contentDetails"],
          maxResults: 15,
        });

        const videoIds =
          playlistItems.data.items
            ?.map((i) => i.contentDetails?.videoId ?? "")
            .filter(Boolean) || [];

        if (videoIds.length === 0) {
          logger.info(TASK_NAME, `No videos found for ${influencer.handle}`);

          influencerErrors.push({
            id: influencer.id,
            handle: influencer.handle,
            platform: influencer.platform,
            platform_error: "No videos found",
          });

          continue;
        }

        // 3. Get detailed video stats (views and ad status)
        const videos = await youtube_client.videos.list({
          id: videoIds,
          part: ["statistics", "snippet", "paidProductPlacementDetails"],
        });

        const contents =
          videos.data.items?.map((i) => ({
            influencer_id: influencer.id,
            published_at: i.snippet?.publishedAt
              ? new Date(i.snippet.publishedAt).toISOString()
              : new Date().toISOString(),
            view_count: Number(i.statistics?.viewCount ?? 0),
            is_ad:
              i.paidProductPlacementDetails?.hasPaidProductPlacement ?? false,
          })) || [];

        contentsToUpsert.push(...contents);
      } catch (err) {
        logger.error(
          TASK_NAME,
          `Error fetching contents for ${influencer.handle}`,
          err,
        );

        influencerErrors.push({
          id: influencer.id,
          handle: influencer.handle,
          platform: influencer.platform,
          platform_error: err instanceof Error ? err.message : String(err),
        });
      }
    }

    if (contentsToUpsert.length > 0) {
      const validInfluencerIds = Array.from(
        new Set(contentsToUpsert.map((c) => c.influencer_id)),
      );

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

      const { error } = await supabase.from("contents").upsert(contentsToUpsert);
      if (error) {
        logger.error(TASK_NAME, "Failed to upsert contents to Supabase", error);
        return;
      }
      logger.success(
        TASK_NAME,
        `Successfully upserted ${contentsToUpsert.length} content items.`,
      );
    }

    if (influencerErrors.length > 0) {
      await supabase.from("influencers").upsert(influencerErrors);
    }

    logger.success(TASK_NAME, "Content update completed successfully.");
  } catch (error) {
    logger.error(TASK_NAME, "Task failed with error", error);
  }
}
