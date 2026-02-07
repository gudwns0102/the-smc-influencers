import { supabase } from "../lib/supabase";
import { youtube_client } from "../lib/youtube";
import { logger } from "../utils/logger";

const TASK_NAME = "YouTube Contents";

export async function fillYoutubeContents() {
  logger.divider();
  logger.info(TASK_NAME, "Starting task...");
  try {
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
      .eq("platform", "youtube")
      .is("platform_error", null)
      .is("contents", null)
      .limit(1000);

    const influencers = result.data || [];

    if (influencers.length === 0) {
      logger.info(TASK_NAME, "No influencers found needing content update.");
      return;
    }

    logger.info(
      TASK_NAME,
      `Found ${influencers.length} influencers: ${influencers.map((i) => i.handle).join(", ")}`,
    );

    const allContents: {
      influencer_id: string;
      published_at: string;
      view_count: number;
      is_ad: boolean;
    }[] = [];

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

        allContents.push(...contents);
      } catch (err) {
        logger.error(
          TASK_NAME,
          `Error fetching contents for ${influencer.handle}`,
          err,
        );
      }
    }

    if (allContents.length > 0) {
      const { error } = await supabase.from("contents").upsert(allContents);
      if (error) {
        logger.error(TASK_NAME, "Failed to upsert contents to Supabase", error);
        return;
      }
      logger.success(
        TASK_NAME,
        `Successfully upserted ${allContents.length} content items.`,
      );
    }

    logger.success(TASK_NAME, "Content update completed successfully.");
  } catch (error) {
    logger.error(TASK_NAME, "Task failed with error", error);
  }
}
