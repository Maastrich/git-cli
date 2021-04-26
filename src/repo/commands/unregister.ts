import inquirer from "inquirer";
import store from '../Storager';

export default async function unregister(profile: string, reponame: string | undefined, options: { all: boolean }) {
  const allRegistered = store.get('registered') ?? {};
  if (options.all) {
    store.set('registered', { ...allRegistered, [profile]: [] })
    return;
  }
  if (!reponame) {
    const registered: string[] = allRegistered[profile] ?? [];
    const { toUnRegister } = await inquirer.prompt<{ toUnRegister: string[] }>([
      {
        type: 'checkbox',
        name: 'toUnRegister',
        message: `Which repository do you want to unregister from ${profile}?`,
        choices: registered.map((each) => ({ name: each })),
      }
    ]);
    store.set('registered', { ...allRegistered, [profile]: registered.filter(each => !toUnRegister.includes(each)) })
    console.log(`Successfully unregisterd [${toUnRegister.join(', ')}] from ${profile}`)
  }
}