import inquirer from "inquirer";
import program from "commander";
// @ts-ignore
import store from '../Storager';
import git from '../Git';
import { join } from "path";
import { existsSync, mkdirSync } from "fs";

export default async function sync(profile: string, reponame: string) {
  const allRegistered = store.get('registered') ?? {};
  const registered = Object.keys(allRegistered);
  if (!profile) {
    const { selected } = await inquirer.prompt<{ selected: string }>([
      {
        type: 'list',
        name: 'selected',
        message: 'Wich org/user do you want to sync ?',
        choices: registered
      }
    ]);
    profile = selected;
  }
  if (!registered.includes(profile)) {
    console.error(`${profile}: not registered, you may have fogetten to run '${program.name()} register'`)
    process.exit(1);
  }
  if (!reponame) {
    const repos: string[] = allRegistered[profile] ?? [];
    const { toSync } = await inquirer.prompt<{ toSync: string[] }>([
      {
        type: 'checkbox',
        name: 'toSync',
        message: `Which repository do you want to unregister from ${profile}`,
        choices: repos.map((each) => ({ name: each })),
      }
    ]);
    toSync.forEach(async (repo) => {
      const dest = join(store.get('basePath') ?? process.cwd(), repo);
      if (!existsSync(dest)) {
        mkdirSync(dest);
      }
      const branches = await git.listBranch(profile, repo, false);
      branches.forEach((branch) => {
        if (!existsSync(join(dest, branch.name))) {
          mkdirSync(join(dest, branch.name), { recursive: true });
        }
      })
    })
    console.log(`Successfully sync [${(toSync ?? []).join(', ')}] from ${profile}`)
  }
}