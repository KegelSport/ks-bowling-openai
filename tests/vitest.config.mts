import path from "node:path";
import { cloudflareTest, readD1Migrations } from "@cloudflare/vitest-pool-workers";
import { defineConfig } from "vitest/config";

const migrationsPath = path.join(__dirname, "..", "migrations");
const migrations = await readD1Migrations(migrationsPath);

export default defineConfig({
	plugins: [
		cloudflareTest({
			wrangler: {
				configPath: "./wrangler.jsonc",
			},
			miniflare: {
				compatibilityFlags: ["experimental", "nodejs_compat"],
				bindings: {
					MIGRATIONS: migrations,
				},
				d1Databases: {
					license_service_db: "license_service_db",
				},
			},
		}),
	],
	test: {
		setupFiles: ["./tests/apply-migrations.ts"],
	},
});
