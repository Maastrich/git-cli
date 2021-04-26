import inquirer from "inquirer";
import program from "commander";
import store from '../Storager';
import simpleGit from "simple-git";
import git from '../Git';
import { join } from "path";
import { existsSync, mkdirSync } from "fs";

export default async function sync(profile: string, reponame: string) {
  const allRegistered = store.get('registered');
  if (!profile) {
    const { selected } = await inquirer.prompt<{ selected: string }>([
      {
        type: 'list',
        name: 'selected',
        message: 'Wich org/user do you want to sync ?',
        choices: allRegistered.map((registered) => registered.name)
      }
    ]);
    profile = selected;
  }
  if (!allRegistered.find((registered) => registered.name === profile)) {
    console.error(`${profile}: not registered, you may have fogetten to run '${program.name()} register ${profile}'`)
    process.exit(1);
  }
  if (!reponame) {
    const repos: string[] = Object.keys(await git.repoList(profile, false))
    const { toSync } = await inquirer.prompt<{ toSync: string[] }>([
      {
        type: 'checkbox',
        name: 'toSync',
        message: `Which repository do you want to unregister from ${profile}`,
        choices: repos.map((each) => ({ name: each })),
      }
    ]);
    toSync.forEach(async (repo) => {
      const dest = join(allRegistered.find((registered) => registered.name === profile)!.path, repo)
      console.log(dest);
      if (!existsSync(dest)) {
        mkdirSync(dest, { recursive: true });
      }
      const branches = await git.listBranch(profile, repo, false);
      branches.forEach((branch) => {
        const branchPath = join(dest, branch.name);
        if (!existsSync(branchPath)) {
          mkdirSync(branchPath, { recursive: true });
        }
        const localGit = simpleGit(branchPath);
        localGit.init()
          .addRemote('origin', `https://github.com/${profile}/${repo}`)
          .checkoutLocalBranch(branch.name);
      })
    })
    console.log(`Successfully sync [${(toSync ?? []).join(', ')}] from ${profile}`)
  } else {
    if (!Object.keys(await git.repoList(profile, false)).includes(reponame)) {
      console.error(`Repository ${reponame} doesn't appear to be listed in ${profile}'s repositories`)
      process.exit(1);
    }
    const dest = join(allRegistered.find((registered) => registered.name === profile)!.path, reponame)
    if (!existsSync(dest)) {
      mkdirSync(dest, { recursive: true });
    }
    const branches = await git.listBranch(profile, reponame, false);
    branches.forEach((branch) => {
      const branchPath = join(dest, branch.name);
      if (!existsSync(branchPath)) {
        mkdirSync(branchPath, { recursive: true });
      }
      const localGit = simpleGit(branchPath);
      localGit
        .init()
        .addRemote('origin', `https://github.com/${profile}/${reponame}`)
        .checkoutLocalBranch(branch.name);
    })
  }
}