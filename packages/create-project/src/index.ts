/**
 * create-squared-agent
 *
 * Create a new project with Squared Agent.
 * Usage: npm create squared-agent [project-name]
 */

import { Command } from "commander";
import chalk from "chalk";
import inquirer from "inquirer";
import ora from "ora";
import { VERSION } from "@squared-agent/core";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

const program = new Command();

program
  .name("create-squared-agent")
  .description("Create a new project with Squared Agent")
  .version(VERSION)
  .argument("[project-name]", "Name of the project")
  .option("-t, --template <template>", "Template to use")
  .action(async (projectName, options) => {
    console.log(chalk.bold("\n🚀 Create Squared Agent Project\n"));

    // Get project name if not provided
    if (!projectName) {
      const answers = await inquirer.prompt([
        {
          type: "input",
          name: "projectName",
          message: "Project name:",
          default: "my-project",
        },
      ]);
      projectName = answers.projectName;
    }

    // Get template if not provided
    let template = options.template;
    if (!template) {
      const answers = await inquirer.prompt([
        {
          type: "list",
          name: "template",
          message: "Select a template:",
          choices: [
            { name: "Default - Basic project setup", value: "default" },
            { name: "Next.js - With Better Auth and Drizzle", value: "nextjs" },
            { name: "API - Hono API service", value: "api" },
          ],
        },
      ]);
      template = answers.template;
    }

    const spinner = ora(`Creating project: ${projectName}`).start();

    try {
      // Create project directory
      const projectDir = join(process.cwd(), projectName);
      await mkdir(projectDir, { recursive: true });

      // Create basic SETUP.md
      const setupContent = `# ${projectName}

Created with Squared Agent.

## Getting Started

1. Open this folder with Claude Code:
   \`\`\`bash
   claude .
   \`\`\`

2. Tell Claude: "Help me set up this project with the ${template} template"

## Template: ${template}

This project was scaffolded with the \`${template}\` template.
`;

      await writeFile(join(projectDir, "SETUP.md"), setupContent);

      spinner.succeed(chalk.green(`Created project: ${projectName}`));

      console.log();
      console.log("Next steps:");
      console.log(chalk.cyan(`  cd ${projectName}`));
      console.log(chalk.cyan("  claude ."));
      console.log(chalk.cyan('  Tell Claude: "Read SETUP.md and help me set up"'));
      console.log();
    } catch (error) {
      spinner.fail(chalk.red("Failed to create project"));
      console.error(error);
      process.exit(1);
    }
  });

program.parse();
