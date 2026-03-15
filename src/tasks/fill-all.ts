import { fillInstagramContents } from "./fill-instagram-contents";
import { fillYoutubeContents } from "./fill-youtube-contents";
import { fillInstagramProfile } from "./fill-instagram-profile";
import { fillYoutubeProfile } from "./fill-youtube-profile";
import { fillFeaturings } from "./fill-featurings";
import type { Database } from "../lib/database.types";

export async function fillAll(
  task: string,
  influencers: Pick<
    Database["public"]["Tables"]["influencers"]["Row"],
    "id" | "handle" | "platform" | "display_name"
  >[],
) {
  if (task === "profile" || task === "all") {
    await Promise.all([
      fillInstagramProfile(
        influencers.filter(
          (i): i is typeof i & { platform: "instagram" } =>
            i.platform === "instagram",
        ),
      ),
      fillYoutubeProfile(
        influencers.filter(
          (i): i is typeof i & { platform: "youtube" } =>
            i.platform === "youtube",
        ),
      ),
    ]);
  }

  if (task === "featurings" || task === "all") {
    await Promise.all([
      fillFeaturings(influencers),
      fillInstagramContents(
        influencers.filter(
          (i): i is typeof i & { platform: "instagram" } =>
            i.platform === "instagram",
        ),
      ),
      fillYoutubeContents(
        influencers.filter(
          (i): i is typeof i & { platform: "youtube" } =>
            i.platform === "youtube",
        ),
      ),
    ]);
  }
}
