import { existsSync } from "fs";
import { writeFileSync } from "fs";
import { readFileSync } from "fs";
import { join } from "path";
import humanizeDuration from "humanize-duration";

export type Storage = {
  creationDate: number,
  lastUpdate: number,
  location: string,
  auth?: string,
  basePath: string,
  registered: {
    [k: string]: string[]
  }
  login?: string
  syncPaths: {
    [k: string]: string
  }
}

class Storager {
  private readonly configPath: string = join(process.env.HOME ?? '/', '.msrc');
  public config: Storage;
  constructor() {
    if (!existsSync(this.configPath)) {
      writeFileSync(this.configPath, JSON.stringify({
        creationDate: Date.now(),
        lastUpdate: Date.now(),
        location: this.configPath,
        registered: {},
        syncPaths: {}
      }));
      console.info(`Configuration file created at ${this.configPath}`);
      this.config = JSON.parse(readFileSync(this.configPath).toString());
    } else {
      this.config = JSON.parse(readFileSync(this.configPath).toString());
    }
  }
  public update() {
    this.config.lastUpdate = Date.now();
    writeFileSync(this.configPath, JSON.stringify(this.config));
    this.refresh();
  }

  public refresh() {
    this.config = JSON.parse(readFileSync(this.configPath).toString());
  }


  public getConfig(): Storage {
    this.refresh
    return this.config
  }
  public get<K extends keyof Storage>(key: K): Storage[K] {
    this.refresh();
    return this.config[key];
  }

  public set<K extends keyof Storage>(key: K, value: Storage[K]) {
    this.refresh();
    this.config[key] = value;
    this.update();
  }
}

export default new Storager();