"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
var fs_2 = require("fs");
var fs_3 = require("fs");
var path_1 = require("path");
var Storager = /** @class */ (function () {
    function Storager() {
        var _a;
        this.configPath = path_1.join((_a = process.env.HOME) !== null && _a !== void 0 ? _a : '/', '.msrc');
        if (!fs_1.existsSync(this.configPath)) {
            fs_2.writeFileSync(this.configPath, JSON.stringify({
                creationDate: Date.now(),
                lastUpdate: Date.now(),
                location: this.configPath,
                registered: {},
                syncPaths: {}
            }));
            console.info("Configuration file created at " + this.configPath);
            this.config = JSON.parse(fs_3.readFileSync(this.configPath).toString());
        }
        else {
            this.config = JSON.parse(fs_3.readFileSync(this.configPath).toString());
        }
    }
    Storager.prototype.update = function () {
        this.config.lastUpdate = Date.now();
        fs_2.writeFileSync(this.configPath, JSON.stringify(this.config));
        this.refresh();
    };
    Storager.prototype.refresh = function () {
        this.config = JSON.parse(fs_3.readFileSync(this.configPath).toString());
    };
    Storager.prototype.getConfig = function () {
        this.refresh;
        return this.config;
    };
    Storager.prototype.get = function (key) {
        this.refresh();
        return this.config[key];
    };
    Storager.prototype.set = function (key, value) {
        this.refresh();
        this.config[key] = value;
        this.update();
    };
    return Storager;
}());
exports.default = new Storager();
