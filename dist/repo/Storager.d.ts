export declare type Storage = {
    creationDate: number;
    lastUpdate: number;
    location: string;
    auth?: string;
    basePath: string;
    registered: {
        [k: string]: string[];
    };
    login?: string;
    syncPaths: {
        [k: string]: string;
    };
};
declare class Storager {
    private readonly configPath;
    config: Storage;
    constructor();
    update(): void;
    refresh(): void;
    getConfig(): Storage;
    get<K extends keyof Storage>(key: K): Storage[K];
    set<K extends keyof Storage>(key: K, value: Storage[K]): void;
}
declare const _default: Storager;
export default _default;
