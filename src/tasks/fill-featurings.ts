import { supabase } from "../lib/supabase";
import { logger } from "../utils/logger";
import { filterNull, randomDelay } from "../utils/helpers";

const TASK_NAME = "Featuring Audience";

type SearchResultItem = {
  platform_code: string;
  username: string;
  full_name: string;
  platform_pk: string;
  category_1: string;
  category_2: string;
};

export async function fillFeaturings() {
  logger.divider();
  logger.info(TASK_NAME, "Starting task...");
  const result = await supabase
    .from("influencers")
    .select("*")
    .is("platform_error", null)
    .is("featuring_error", null)
    .is("age_1317_pct", null)
    .limit(1000);

  const influencers = result.data || [];

  if (influencers.length === 0) {
    logger.info(TASK_NAME, "No influencers found needing audience update.");
    return;
  }

  logger.info(
    TASK_NAME,
    `Found ${influencers.length} influencers: ${influencers.map((i) => i.handle).join(", ")}`,
  );

  const commonHeaders = {
    "Content-Type": "application/json",
    "User-Agent":
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36",
  };

  const featuring_email = process.env["FEATURING_EMAIL"];
  const featuring_password = process.env["FEATURING_PASSWORD"];

  if (!featuring_email || !featuring_password) {
    throw new Error("Missing Featuring credentials in environment variables");
  }

  const loginResponse = await fetch("https://app.featuring.co/api/login/", {
    method: "POST",
    headers: commonHeaders,
    body: JSON.stringify({
      email: featuring_email,
      password: featuring_password,
      autoLogin: true,
    }),
  });

  const loginData = (await loginResponse.json()) as any;
  const access_token = loginData.result.access_token;
  const authHeaderValue = `Bearer ${access_token}`;
  const authHeaders = {
    ...commonHeaders,
    Authorization: authHeaderValue,
    "Ft-Workspace": "CQXKUDYMML",
  };

  await fetch("https://prod-api.featuring.co/member/auth/login-device/", {
    method: "POST",
    headers: authHeaders,
    body: JSON.stringify({}),
  });
  const response3 = await fetch(
    "https://prod-api.featuring.co/member/auth/login-device/",
    {
      method: "GET",
      headers: authHeaders,
    },
  );
  const deviceListData = (await response3.json()) as any;
  const [_, __, ...logoutDeviceList] = deviceListData.result;
  for (const device of logoutDeviceList) {
    await fetch("https://prod-api.featuring.co/member/auth/login-device/", {
      method: "DELETE",
      body: JSON.stringify({
        device_id: device.device_id,
      }),
      headers: authHeaders,
    });
  }

  try {
    for (let i = 0; i < influencers.length; i++) {
      const influencer = influencers[i]!;
      logger.progress(
        TASK_NAME,
        i + 1,
        influencers.length,
        `Processing ${influencer.platform}:${influencer.handle}`,
      );

      // Filter out null or empty string
      const keywords = [influencer.display_name, influencer.handle]
        .filter(filterNull)
        .filter((i) => !!i);

      let search_result_item: SearchResultItem | undefined;

      const featuring_platform_code =
        influencer.platform === "youtube" ? "yt" : "ig";

      try {
        for (const keyword of keywords) {
          const searchUrl = new URL(
            "https://prod-api.featuring.co/discover/explore/all/account-search/",
          );
          searchUrl.searchParams.append("page", "1");
          searchUrl.searchParams.append("keyword", keyword);
          const searchResponse = await fetch(searchUrl, {
            method: "GET",
            headers: authHeaders,
          });
          const searchResultData = (await searchResponse.json()) as {
            result: {
              results: SearchResultItem[];
            };
          };
          const {
            result: { results },
          } = searchResultData;

          search_result_item = results.find(
            (item) =>
              item.platform_code === featuring_platform_code &&
              (item.username === keyword || item.full_name === keyword),
          );

          if (search_result_item) {
            break;
          }
        }

        if (!search_result_item) {
          throw new Error(
            `Handle not found in Featuring: ${influencer.handle}`,
          );
        }

        logger.info(
          TASK_NAME,
          `Found account: ${search_result_item.full_name} (${search_result_item.platform_pk})`,
        );

        const audienceResponse = await fetch(
          `https://prod-api.featuring.co/report/v2/${featuring_platform_code}/${search_result_item.platform_pk}/`,
          {
            method: "GET",
            headers: authHeaders,
          },
        );

        const audienceData = (await audienceResponse.json()) as {
          result: {
            audience: {
              main_audience: {
                main_group_gender: string;
                main_group_name: string;
                main_group_rate: number;
              };
              female_age_group: Array<{
                group_name: string;
                group_value: number;
              }>;
              male_age_group: Array<{
                group_name: string;
                group_value: number;
              }>;
              language_summary: {
                language_list: Array<{
                  name: string;
                  value: number;
                }>;
              } | null;
            };
          };
        };

        if (!audienceData.result || !audienceData.result.audience) {
          throw new Error("Failed to fetch audience data from Featuring");
        }

        const { male_age_group, female_age_group, language_summary } =
          audienceData.result.audience;

        const gender_male_pct = male_age_group.reduce(
          (acc: number, item: any) => acc + item.group_value,
          0,
        );
        const gender_female_pct = female_age_group.reduce(
          (acc: number, item: any) => acc + item.group_value,
          0,
        );
        const all_groups = [...male_age_group, ...female_age_group];
        const age_1317_pct = all_groups
          .filter((item: any) => item.group_name === "13-17")
          .reduce((acc: number, item: any) => acc + item.group_value, 0);
        const age_1824_pct = all_groups
          .filter((item: any) => item.group_name === "18-24")
          .reduce((acc: number, item: any) => acc + item.group_value, 0);
        const age_2534_pct = all_groups
          .filter((item: any) => item.group_name === "25-34")
          .reduce((acc: number, item: any) => acc + item.group_value, 0);
        const age_3544_pct = all_groups
          .filter((item: any) => item.group_name === "35-44")
          .reduce((acc: number, item: any) => acc + item.group_value, 0);
        const language_kr_pct =
          language_summary?.language_list?.find(
            (item: any) => item.name === "Korean",
          )?.value ?? null;

        const round = (val: number | null) =>
          val === null ? null : Math.round(val * 10) / 10;

        const payload = {
          category_tag_main: search_result_item.category_1 || null,
          category_tag_sub: search_result_item.category_2 || null,
          gender_male_pct: round(gender_male_pct),
          gender_female_pct: round(gender_female_pct),
          age_1317_pct: round(age_1317_pct),
          age_1824_pct: round(age_1824_pct),
          age_2534_pct: round(age_2534_pct),
          age_3544_pct: round(age_3544_pct),
          language_kr_pct: round(language_kr_pct),
          featuring_error: null, // Clear error on success
        };

        const result = await supabase
          .from("influencers")
          .update(payload)
          .eq("id", influencer.id);

        if (result.error) {
          throw result.error;
        }

        logger.success(TASK_NAME, `Updated audience for ${influencer.handle}`);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        logger.error(
          TASK_NAME,
          `Failed to process ${influencer.handle}: ${errorMessage}`,
        );

        // Record the error in the database
        await supabase
          .from("influencers")
          .update({ featuring_error: errorMessage })
          .eq("id", influencer.id);
      }

      // Add a random delay between 1 and 3 seconds to avoid detection
      await randomDelay(5000, 8000);
    }
  } finally {
    logger.info(TASK_NAME, "Logging out from Featuring...");
    await fetch("https://prod-api.featuring.co/member/auth/login-device/", {
      method: "DELETE",
      headers: authHeaders,
      body: JSON.stringify({
        device_id: authHeaderValue,
      }),
    });
    logger.success(TASK_NAME, "Task completed.");
  }
}
