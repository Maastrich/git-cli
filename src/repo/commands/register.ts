
import inquirer from 'inquirer';
import { resolve } from 'path';
import git from '../Git';
import store from '../Storager';

export default async function register(profile: string, reponame: string, options: { all: boolean, user: boolean }) {

  const allRegistered = store.get('registered');
  const registered = allRegistered.find((owner) => owner.name === profile);

  if (registered) {
    const { change } = await inquirer.prompt<{ change: boolean }>([{
      type: 'confirm',
      name: 'change',
      message: `"${profile}" is already registered at '${registered.path}', do you want to change its path ?`,
    }]);
    if (!change) {
      return;
    }
    const { path } = await inquirer.prompt<{ path: string }>([{
      type: 'path',
      name: 'path',
      default: process.env.HOME || '/',
      message: `Give me the relative path to the location where you want to save your repositories from "${profile}"`
    }]);
    const newRegistration = allRegistered.filter(({ name }) => name !== profile)
    newRegistration.push({ name: profile, path: resolve(process.env.HOME || '/', path) });
    store.set('registered', newRegistration);
  } else {
    const { path } = await inquirer.prompt<{ path: string }>([{
      type: 'path',
      name: 'path',
      default: process.env.HOME || '/',
      message: `Give me the relative path to the location where you want to save your repositories from "${profile}"`
    }]);
    allRegistered.push({ name: profile, path: resolve(process.env.HOME || '/', path) });
    store.set('registered', allRegistered);
  }

  // const repos = Object.keys(await git.repoList(profile, options.user));
  // const allRegistered = store.get('registered') ?? {};
  // const registered: string[] = allRegistered![profile] ?? [];
  // if (options.all) {
  //   store.set('registered', { ...allRegistered, [profile]: repos });
  //   console.log(`Successfully registerd [${repos.filter(each => !registered.includes(each)).join(', ')}] from ${profile}`)
  //   return;
  // }
  // if (!reponame) {
  //   const { toRegister } = await inquirer.prompt<{ toRegister: string[] }>([
  //     {
  //       type: 'checkbox',
  //       name: 'toRegister',
  //       message: `Which repository do you want to register from ${profile}?`,
  //       choices: [
  //         new inquirer.Separator("Not registered:"),
  //         ...repos.filter(each => !registered.includes(each)).map((each) => ({ name: each })),
  //         new inquirer.Separator("Already registered:"),
  //         ...repos.filter(each => registered.includes(each)).map((each) => ({ name: each, disabled: true })),
  //       ],
  //     }
  //   ]);
  //   store.set('registered', { ...allRegistered, [profile]: [...registered, ...toRegister] });
  //   console.log(`Successfully registerd [${toRegister.join(', ')}] from ${profile}`)
  // } else {

  // }
}