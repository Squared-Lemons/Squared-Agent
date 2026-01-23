/**
 * @squared-agent/cli
 *
 * CLI for bootstrapping projects with Claude Code.
 */

import { Command } from "commander";
import chalk from "chalk";
import ora from "ora";
import { VERSION } from "@squared-agent/core";

const program = new Command();

program
  .name("squared-agent")
  .description("Bootstrap projects with Claude Code")
  .version(VERSION);

program
  .command("init")
  .description("Initialize a new project with Squared Agent")
  .option("-t, --template <template>", "Template to use", "default")
  .action(async (options) => {
    const spinner = ora("Initializing project...").start();

    try {
      // TODO: Implement project initialization
      spinner.succeed(chalk.green("Project initialized successfully!"));
      console.log();
      console.log("Next steps:");
      console.log(chalk.cyan("  1. cd into your project"));
      console.log(chalk.cyan("  2. Run: claude ."));
      console.log(chalk.cyan('  3. Tell Claude: "Read SETUP.md and help me set up"'));
    } catch (error) {
      spinner.fail(chalk.red("Failed to initialize project"));
      console.error(error);
      process.exit(1);
    }
  });

program
  .command("list")
  .description("List available templates")
  .action(() => {
    console.log(chalk.bold("\nAvailable templates:\n"));
    console.log("  default     - Basic project setup");
    console.log("  nextjs      - Next.js with Better Auth and Drizzle");
    console.log("  api         - API service with Hono");
    console.log();
  });

program.parse();
