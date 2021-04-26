"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var inquirer_1 = __importDefault(require("inquirer"));
var commander_1 = __importDefault(require("commander"));
// @ts-ignore
var inquirer_path_1 = require("inquirer-path");
var Storager_1 = __importDefault(require("./Storager"));
var Git_1 = __importDefault(require("./Git"));
var config_1 = __importDefault(require("./commands/config"));
var list_1 = __importDefault(require("./commands/list"));
var register_1 = __importDefault(require("./commands/register"));
var unregister_1 = __importDefault(require("./commands/unregister"));
var sync_1 = __importDefault(require("./commands/sync"));
inquirer_1.default.prompt.registerPrompt('path', inquirer_path_1.PathPrompt);
// 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
function loadConfig() {
    return new Promise(function (resolve, reject) {
        if (!Storager_1.default.get('auth')) {
            inquirer_1.default.prompt([{
                    type: 'input',
                    name: 'token',
                    message: 'Github Personal Access Token (https://github.com/settings/tokens):'
                }]).then(function (_a) {
                var token = _a.token;
                if (token.length) {
                    Storager_1.default.set('auth', token);
                    Git_1.default.register();
                }
                else {
                    console.log();
                }
                resolve();
            }).catch(function (e) {
                reject(e);
            });
        }
        else {
            resolve();
        }
    });
}
;
loadConfig().then(function () {
    commander_1.default
        .version('0.0.1')
        .name('ms-cli repo')
        .usage('[command] [options]');
    commander_1.default.command('config')
        .action(config_1.default);
    commander_1.default
        .command('list <team|user>')
        .option('-u, --user', 'Team name', false)
        .action(list_1.default);
    commander_1.default
        .command('register <org|user> [reponame]')
        .option('-u, --user', 'Specify that the give profile is a user, not an organization', false)
        .option('-a, --all', 'Register all repositories', false)
        .action(register_1.default);
    commander_1.default
        .command('unregister <org|user> [reponame]')
        .option('-a, --all', '', false)
        .action(unregister_1.default);
    commander_1.default
        .command('sync [org|user] [reponame]')
        .option('-a, --all', '', false)
        .action(sync_1.default);
    commander_1.default.parse(process.argv);
});
