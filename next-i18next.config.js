// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require("path");

/** @type {import('next-i18next').UserConfig} */
module.exports = {
  debug: true,
  i18n: {
    defaultLocale: "en",
    locales: ["en", "es"],
  },
  localePath:
    typeof window === "undefined"
      ? path.resolve("./public/locales")
      : "/locales",

  reloadOnPrerender: process.env.NODE_ENV === "development",
};
