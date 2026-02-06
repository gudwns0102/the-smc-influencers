import { youtube_v3 } from "@googleapis/youtube";

const google_api_key = process.env["GOOGLE_API_KEY"];

if (!google_api_key) {
  throw new Error("Missing GOOGLE_API_KEY in environment variables");
}

export const youtube_client = new youtube_v3.Youtube({
  auth: google_api_key,
});
