import inquirer from "inquirer";
import program from "commander";
// @ts-ignore
import { PathPrompt } from 'inquirer-path';
import store from './Storager';
import git from './Git';
import config from "./commands/config";
import list from "./commands/list";
import register from "./commands/register";
import unregister from "./commands/unregister";
import sync from "./commands/sync";

inquirer.prompt.registerPrompt('path', PathPrompt);
function loadConfig() {
  return new Promise<void>((resolve, reject) => {
    if (!store.get('auth')) {
      inquirer.prompt<{ token: string }>(
        [{
          type: 'input',
          name: 'token',
          message: 'Github Personal Access Token (https://github.com/settings/tokens):'
        }]).then(({ token }) => {
          if (token.length) {
            store.set('auth', token);
            git.register();
          } else {
            console.log()
          }
          resolve();
        }).catch(e => {
          reject(e);
        })
    }
    else {
      resolve();
    }
  })
};

loadConfig().then(() => {
  program
    .version('0.0.1')
    .name('ms-cli repo')
    .usage('[command] [options]')

  program.command('config')
    .action(config)

  program
    .command('list <team|user>')
    .option('-u, --user', 'Team name', false)
    .action(list)

  program
    .command('register <org|user>')
    .option('-u, --user', 'Specify that the give profile is a user, not an organization', false)
    .action(register)

  program
    .command('unregister <org|user> [reponame]')
    .option('-a, --all', '', false)
    .action(unregister)

  program
    .command('sync [org|user] [reponame]')
    .option('-a, --all', '', false)
    .action(sync)

  program.parse(process.argv)
})