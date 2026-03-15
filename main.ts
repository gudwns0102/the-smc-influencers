import "dotenv/config";
import { supabase } from "./src/lib/supabase";
import { fillAll } from "./src/tasks/fill-all";

const task = process.env["TASK_TO_RUN"] || "all";

console.log(`🚀 Running task: ${task}`);

try {
  const { data } = await supabase
    .from("influencers")
    .update({ updated_at: new Date().toISOString() })
    .in("get_influencer_status", ["new", "in_progress"])
    .limit(500)
    .select();

  const new_influencers = data || [];

  if (new_influencers.length === 0) {
    console.log("✨ No new influencers found.");
    process.exit(0);
  }

  await fillAll(task, new_influencers);

  console.log("✨ All selected tasks completed.");
} catch (error) {
  console.error("💥 General task execution failed:", error);
  process.exit(1);
}
