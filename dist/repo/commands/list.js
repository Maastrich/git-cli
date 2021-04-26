"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Git_1 = __importDefault(require("../Git"));
function list(profile, options) {
    Git_1.default.repoList(profile, options.user).then(function (repos) {
        console.table(Object.keys(repos).map(function (repo) { return ({
            name: repos[repo].name,
            url: repos[repo].url,
            private: repos[repo].private,
        }); }));
    });
}
exports.default = list;
