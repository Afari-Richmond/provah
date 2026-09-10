/**
 * Conventional Commits (https://www.conventionalcommits.org/en/v1.0.0/),
 * enforced via the commit-msg hook in .husky/.
 */
export default {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "scope-enum": [
      2,
      "always",
      [
        "mobile-app",
        "server",
        "auth",
        "students",
        "professionals",
        "projects",
        "discovery",
        "connections",
        "notifications",
        "platform",
        "migrations",
        "context",
        "repo",
      ],
    ],
  },
};
