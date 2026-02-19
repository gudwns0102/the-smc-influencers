import "dotenv/config";

const task = process.env["TASK_TO_RUN"] || "all";

console.log(`🚀 Running task: ${task}`);

try {
  // if (task === "profile" || task === "all") {
  //   await fillInstagramProfile({ is_planning: false });
  //   await fillYoutubeProfile({ is_planning: false });
  // }

  // if (task === "featurings" || task === "all") {
  //   await fillFeaturings();
  // }

  // if (task === "contents" || task === "all") {
  //   await fillInstagramContents();
  //   await fillYoutubeContents();
  // }

  console.log("✨ All selected tasks completed.");
} catch (error) {
  console.error("💥 General task execution failed:", error);
  process.exit(1);
}
