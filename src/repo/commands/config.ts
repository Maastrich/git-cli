import inquirer from 'inquirer';
import store from '../Storager'

export default async function () {
  const actualConfig = store.getConfig();
  const { path } = await inquirer.prompt<{ path: string }>([
    {
      type: 'path',
      name: 'path',
      default: process.cwd(),
      message: `Please give me the relative path to the destionation you will want to sync you repositories ${(!!actualConfig.basePath) ? ` (current: ${actualConfig.basePath}))` : ''}: `,
    }
  ]);
  store.set('basePath', path);
}