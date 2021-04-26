"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@octokit/core");
var Storager_1 = __importDefault(require("./Storager"));
var Git = /** @class */ (function () {
    function Git() {
        var _a;
        this.octokit = new core_1.Octokit({
            baseUrl: 'https://api.github.com',
            auth: (_a = Storager_1.default.get('auth')) !== null && _a !== void 0 ? _a : ''
        });
    }
    Git.prototype.register = function () {
        var _a;
        this.octokit = new core_1.Octokit({
            baseUrl: 'https://api.github.com',
            auth: (_a = Storager_1.default.get('auth')) !== null && _a !== void 0 ? _a : ''
        });
        this.octokit.request('GET /user', {}).then(function (_a) {
            var login = _a.data.login;
            Storager_1.default.set('login', login);
            console.log("Welcome " + login);
        }).catch(function (e) { return console.error(e); });
    };
    Git.prototype.listBranch = function (profile, repo, user) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.octokit.request('GET /repos/{owner}/{repo}/branches', {
                owner: profile,
                repo: repo
            }).then(function (_a) {
                var branches = _a.data;
                resolve(branches);
            });
        });
    };
    Git.prototype.repoList = function (profile, user) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (!user) {
                _this.octokit.request('GET /orgs/{org}/repos', {
                    org: profile
                }).then(function (_a) {
                    var data = _a.data;
                    var repos = {};
                    data.forEach(function (repository) {
                        repos[repository.name] = repository;
                    });
                    resolve(repos);
                });
            }
            else {
                _this.octokit.request('GET /users/{username}/repos', {
                    username: profile,
                    type: 'owner',
                }).then(function (_a) {
                    var repositories = _a.data;
                    var repos = {};
                    repositories.forEach(function (repository) {
                        repos[repository.name] = repository;
                    });
                    resolve(repos);
                });
            }
        });
    };
    return Git;
}());
exports.default = new Git();
