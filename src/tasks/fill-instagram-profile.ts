import { supabase } from "../lib/supabase";
import { apify_client } from "../lib/apify";
import { logger } from "../utils/logger";

const TASK_NAME = "Instagram Profile";

export async function fillInstagramProfile(options?: {
  is_planning?: boolean;
}) {
  logger.divider();
  logger.info(TASK_NAME, "Starting task...");
  try {
    const result = await supabase
      .from("influencers")
      .select("*")
      .eq("platform", "instagram")
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

    const run = await apify_client
      .actor("apify/instagram-profile-scraper")
      .call(
        {
          usernames: influencers.map((i) => i.handle),
        },
        {
          log: null,
        },
      );

    logger.info(TASK_NAME, "Scraper started, fetching results...");

    const { items: profileItems } = await apify_client
      .dataset<
        | {
            username: string;
            fullName: string;
            followersCount: number;
            private: boolean;
          }
        | {
            username: string;
            error: string;
          }
      >(run.defaultDatasetId)
      .listItems();

    logger.info(
      TASK_NAME,
      `Fetched ${profileItems.length} profile items from Apify.`,
    );

    await supabase.from("influencers").upsert(
      influencers.map((influencer) => {
        const profileItem = profileItems.find(
          (item) => item.username === influencer.handle,
        );

        if (!profileItem) {
          // logger.error(
          //   TASK_NAME,
          //   `Profile item not found for ${influencer.handle}`,
          // );
          return {
            id: influencer.id,
            handle: influencer.handle,
            platform: influencer.platform,
            platform_error: "Profile item not found",
          };
        }

        if ("error" in profileItem) {
          // logger.error(
          //   TASK_NAME,
          //   `Apify error for ${influencer.handle}: ${profileItem.error}`,
          // );
          return {
            id: influencer.id,
            handle: influencer.handle,
            platform: influencer.platform,
            platform_error: profileItem.error,
          };
        }

        if (profileItem.private) {
          // logger.error(TASK_NAME, `Private account: ${influencer.handle}`);
          return {
            id: influencer.id,
            handle: influencer.handle,
            platform: influencer.platform,
            display_name: profileItem.fullName,
            follower_count: profileItem.followersCount,
            platform_error: "is_private_account_error",
          };
        }

        return {
          id: influencer.id,
          handle: influencer.handle,
          platform: influencer.platform,
          display_name: profileItem.fullName,
          follower_count: profileItem.followersCount,
        };
      }),
    );

    logger.success(TASK_NAME, "Profile update completed successfully.");
  } catch (error) {
    logger.error(TASK_NAME, "Task failed with error", error);
  }
}
