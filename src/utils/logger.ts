export const logger = {
  info: (task: string, message: string) => {
    console.log(`[${task}] ℹ️ ${message}`);
  },
  success: (task: string, message: string) => {
    console.log(`[${task}] ✅ ${message}`);
  },
  error: (task: string, message: string, detail?: any) => {
    console.error(`[${task}] ❌ ${message}`);
    if (detail) console.error(detail);
  },
  progress: (task: string, current: number, total: number, message: string) => {
    const percentage = Math.round((current / total) * 100);
    console.log(
      `[${task}] 🔄 [${current}/${total}] (${percentage}%) ${message}`,
    );
  },
  divider: () => {
    console.log("--------------------------------------------------");
  },
};
