import "dotenv/config";
import { supabase } from "./src/lib/supabase";
import { logger } from "./src/utils/logger";
import { fillAll } from "./src/tasks/fill-all";

const { data } = await supabase
  .from("influencers")
  .select("*")
  .order("updated_at", { ascending: true })
  .limit(300);

const oldest_influencers = data || [];

if (oldest_influencers.length === 0) {
  console.log("No influencer found.");
  process.exit(0);
}

await supabase
  .from("influencers")
  .update({ updated_at: new Date().toISOString() })
  .in(
    "id",
    oldest_influencers.map((i) => i.id),
  );

logger.info(
  "Refresh",
  `Found ${oldest_influencers.length} influencers: ${oldest_influencers.map((i) => i.handle).join(", ")}`,
);

await fillAll("all", oldest_influencers);

logger.success("Refresh", "All tasks completed successfully.");
