
import git from '../Git'

export default function list(profile: string, options: { user: boolean }) {
  git.repoList(profile, options.user).then((repos) => {
    console.table(Object.keys(repos).map((repo) => ({
      name: repos[repo].name,
      url: repos[repo].url,
      private: repos[repo].private,
    })));
  });
}