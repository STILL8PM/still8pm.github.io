import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectDirectory = path.resolve(scriptDirectory, "..");
const viteCli = path.resolve(projectDirectory, "node_modules/vite/bin/vite.js");
const ghPagesCli = path.resolve(projectDirectory, "node_modules/gh-pages/bin/gh-pages.js");

/** Run a command and stop the release immediately when it fails. */
function run(command, args, cwd = projectDirectory) {
  const result = spawnSync(command, args, {
    cwd,
    stdio: "inherit",
    shell: false,
  });

  if (result.error) {
    throw result.error;
  }
  if (result.status !== 0) {
    throw new Error(`${command} ${args.join(" ")} failed with exit code ${result.status}.`);
  }
}

/** Read command output without invoking a platform-specific shell. */
function read(command, args, cwd = projectDirectory) {
  const result = spawnSync(command, args, {
    cwd,
    encoding: "utf8",
    shell: false,
  });

  if (result.error) {
    throw result.error;
  }
  if (result.status !== 0) {
    throw new Error(result.stderr.trim() || `${command} ${args.join(" ")} failed.`);
  }
  return result.stdout.trim();
}

/** Build, commit, push source code, and publish the generated Pages bundle. */
function release() {
  if (process.argv.includes("--help")) {
    console.log('Usage: npm run release -- "commit message"');
    return;
  }

  const repositoryDirectory = read("git", ["rev-parse", "--show-toplevel"]);
  const branch = read("git", ["branch", "--show-current"], repositoryDirectory);
  if (!branch) {
    throw new Error("A release cannot run from a detached HEAD.");
  }

  const providedMessage = process.argv.slice(2).join(" ").trim();
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const commitMessage = providedMessage || `chore: publish ${timestamp}`;

  console.log("\n[1/4] Building the production bundle...");
  run(process.execPath, [viteCli, "build"]);

  const hasChanges = Boolean(read("git", ["status", "--porcelain"], repositoryDirectory));
  if (hasChanges) {
    console.log("\n[2/4] Committing source changes...");
    run("git", ["add", "--all"], repositoryDirectory);
    run("git", ["commit", "-m", commitMessage], repositoryDirectory);
  } else {
    console.log("\n[2/4] No source changes to commit.");
  }

  console.log(`\n[3/4] Pushing ${branch} to origin...`);
  run("git", ["push", "origin", branch], repositoryDirectory);

  console.log("\n[4/4] Publishing build to gh-pages...");
  run(process.execPath, [ghPagesCli, "-d", "build"]);

  console.log("\nRelease completed: https://still8pm.github.io/");
}

try {
  release();
} catch (error) {
  console.error(`\nRelease failed: ${error.message}`);
  process.exitCode = 1;
}
