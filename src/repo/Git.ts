import { Octokit } from "@octokit/core";
import inquirer from "inquirer";
import { data } from "node-persist";
import store from "./Storager";

class Git {
  private octokit = new Octokit({
    baseUrl: 'https://api.github.com',
    auth: store.get('auth') ?? ''
  });

  register() {
    this.octokit = new Octokit({
      baseUrl: 'https://api.github.com',
      auth: store.get('auth') ?? ''
    });
    this.octokit.request('GET /user', {
    }).then(({ data: { login } }) => {
      store.set('login', login);
      console.log(`Welcome ${login}`);
    }).catch((e) => console.error(e))
  }

  listBranch(profile: string, repo: string, user: boolean) {
    return new Promise<any[]>((resolve, reject) => {
      this.octokit.request('GET /repos/{owner}/{repo}/branches', {
        owner: profile,
        repo
      }).then(({ data: branches }) => {
        resolve(branches);
      })
    })
  }

  repoList(profile: string, user: boolean) {
    return new Promise<{ [k: string]: any }>((resolve, reject) => {
      if (!user) {
        this.octokit.request('GET /orgs/{org}/repos', {
          org: profile
        }).then(({ data }) => {
          let repos: { [k: string]: any } = {};
          data.forEach(repository => {
            repos[repository.name] = repository;
          })
          resolve(repos);
        })
      } else {
        this.octokit.request('GET /users/{username}/repos', {
          username: profile,
          type: 'owner',
        }).then(({ data: repositories }) => {
          let repos: { [k: string]: any } = {};
          repositories.forEach(repository => {
            repos[repository.name] = repository
          })
          resolve(repos);
        })
      }
    })
  }
}

export default new Git();