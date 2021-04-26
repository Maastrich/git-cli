
import inquirer from 'inquirer';
import git from '../Git';
import store from '../Storager';

export default async function register(profile: string, reponame: string, options: { all: boolean, user: boolean }) {
  const repos = Object.keys(await git.repoList(profile, options.user));
  const allRegistered = store.get('registered') ?? {};
  const registered: string[] = allRegistered![profile] ?? [];
  if (options.all) {
    store.set('registered', { ...allRegistered, [profile]: repos });
    console.log(`Successfully registerd [${repos.filter(each => !registered.includes(each)).join(', ')}] from ${profile}`)
    return;
  }
  if (!reponame) {
    const { toRegister } = await inquirer.prompt<{ toRegister: string[] }>([
      {
        type: 'checkbox',
        name: 'toRegister',
        message: `Which repository do you want to register from ${profile}?`,
        choices: [
          new inquirer.Separator("Not registered:"),
          ...repos.filter(each => !registered.includes(each)).map((each) => ({ name: each })),
          new inquirer.Separator("Already registered:"),
          ...repos.filter(each => registered.includes(each)).map((each) => ({ name: each, disabled: true })),
        ],
      }
    ]);
    store.set('registered', { ...allRegistered, [profile]: [...registered, ...toRegister] });
    console.log(`Successfully registerd [${toRegister.join(', ')}] from ${profile}`)
  } else {

  }
}