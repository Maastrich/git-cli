"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var commander_1 = __importDefault(require("commander"));
commander_1.default
    .version('0.0.1')
    .name('ms-cli')
    .usage('[command] [options]');
commander_1.default
    .command('repo', 'Manage your org/user repositories tree', {
    executableFile: './bin/ms-cli-repo'
}).aliases(['', 'r']);
commander_1.default
    .command('test', 'test', {
    executableFile: 'echo'
}).aliases(['', 't']);
commander_1.default.parse(process.argv);
