/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import nextTranslate from "next-translate-plugin";
await import("./src/env.mjs");

export default nextTranslate({
  reactStrictMode: true,
});
