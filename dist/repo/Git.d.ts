declare class Git {
    private octokit;
    register(): void;
    listBranch(profile: string, repo: string, user: boolean): Promise<any[]>;
    repoList(profile: string, user: boolean): Promise<{
        [k: string]: any;
    }>;
}
declare const _default: Git;
export default _default;
