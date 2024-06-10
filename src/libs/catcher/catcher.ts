export { };
export function overrideErrorHandling(): void {
  process.on("uncaughtException", (e) => {
    console.log(e);
  });
}; 