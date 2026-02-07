import { supabase } from "../lib/supabase";
import { youtube_client } from "../lib/youtube";
import { logger } from "../utils/logger";

const TASK_NAME = "YouTube Profile";

export async function fillYoutubeProfile(options?: { is_planning?: boolean }) {
  logger.divider();
  logger.info(TASK_NAME, "Starting task...");
  try {
    const result = await supabase
      .from("influencers")
      .select("*")
      .eq("platform", "youtube")
      .is("follower_count", null)
      .is("platform_error", null)
      .limit(1000);

    const influencers = result.data || [];

    if (influencers.length === 0) {
      logger.info(TASK_NAME, "No influencers found needing profile update.");
      return;
    }

    logger.info(
      TASK_NAME,
      `Found ${influencers.length} influencers: ${influencers.map((i) => i.handle).join(", ")}`,
    );

    if (options?.is_planning) {
      logger.info(TASK_NAME, "Planning done");
      return;
    }

    const updates = [];

    for (const influencer of influencers) {
      try {
        const channels = await youtube_client.channels.list({
          forHandle: influencer.handle,
          part: ["statistics", "snippet"],
        });

        const item = channels.data.items?.[0];

        if (!item) {
          logger.error(
            TASK_NAME,
            `Channel not found for handle: ${influencer.handle}`,
          );
          updates.push({
            id: influencer.id,
            handle: influencer.handle,
            platform: influencer.platform,
            platform_error: "Channel Not Found",
          });
          continue;
        }

        updates.push({
          id: influencer.id,
          handle: influencer.handle,
          platform: influencer.platform,
          display_name: item.snippet?.title || "",
          follower_count: Number(item.statistics?.subscriberCount ?? 0),
        });
      } catch (err: any) {
        logger.error(
          TASK_NAME,
          `Error fetching profile for ${influencer.handle}`,
          err,
        );
        updates.push({
          id: influencer.id,
          handle: influencer.handle,
          platform: influencer.platform,
          platform_error: err.message,
        });
      }
    }

    if (updates.length > 0) {
      const { error } = await supabase.from("influencers").upsert(updates);
      if (error) {
        logger.error(TASK_NAME, "Failed to upsert updates to Supabase", error);
        return;
      }
    }

    logger.success(TASK_NAME, "Profile update completed successfully.");
  } catch (error) {
    logger.error(TASK_NAME, "Task failed with error", error);
  }
}
