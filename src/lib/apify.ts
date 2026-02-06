import { ApifyClient } from "apify-client";

const apify_token = process.env["APIFY_TOKEN"];

if (!apify_token) {
  throw new Error("Missing APIFY_TOKEN in environment variables");
}

export const apify_client = new ApifyClient({
  token: apify_token,
});
