"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
var child_process_1 = require("child_process");
var fs = require("fs");
var config = {
    mainBranch: 'master',
    gitServer: 'https://drc-imaa-ukr-tools.scm.azurewebsites.net:443/drc-imaa-ukr-tools.git',
    username: '$drc-imaa-ukr-tools',
    password: 'rJxEsj09zN3nqknoS9GpxBM1W4vykcqXoZrCNzGungbgKspNMqSePuno4EAY',
};
var run = function (cl) {
    return new Promise(function (resolve, reject) {
        var _a, _b;
        var _ = (0, child_process_1.exec)(cl);
        (_a = _.stdout) === null || _a === void 0 ? void 0 : _a.on('data', console.log);
        (_b = _.stderr) === null || _b === void 0 ? void 0 : _b.on('data', console.error);
        _.on('exit', function (code) {
            if (code === 0) {
                resolve(code);
            }
            else {
                console.log("".concat(cl, " exited with ").concat(code));
                reject(code);
            }
        });
    });
};
var gitWorkspaceIsEmpty = function () { return (0, child_process_1.execSync)("git status --porcelain").toString() === ''; };
var newversion = (_a = process.argv[2]) !== null && _a !== void 0 ? _a : 'patch';
var getPackageVersion = function () { return JSON.parse(fs.readFileSync('package.json', 'utf8')).version; };
var isOnMainBranch = function () { return new RegExp("".concat(config.mainBranch, "s*\n*")).test((0, child_process_1.execSync)('git branch --show-current').toString()); };
(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: 
            // if (!isOnMainBranch()) {
            //   console.error(`You must be on branch ${config.mainBranch} to publish.`)
            // } else if (!gitWorkspaceIsEmpty()) {
            //   console.error(`Your git status must be clean before to publish.`)
            // } else {
            return [4 /*yield*/, run("git remote add azure ".concat(config.gitServer))];
            case 1:
                // if (!isOnMainBranch()) {
                //   console.error(`You must be on branch ${config.mainBranch} to publish.`)
                // } else if (!gitWorkspaceIsEmpty()) {
                //   console.error(`Your git status must be clean before to publish.`)
                // } else {
                _a.sent();
                return [4 /*yield*/, run("git push -f azure ".concat(config.mainBranch))];
            case 2:
                _a.sent();
                return [4 /*yield*/, run("git remote remove azure")
                    // await run(`git commit -m "Release ${getPackageVersion()}"`)
                    // await run(`git push https://${config.username}:${config.password}@${config.gitServer} master`)
                ];
            case 3:
                _a.sent();
                // await run(`git commit -m "Release ${getPackageVersion()}"`)
                // await run(`git push https://${config.username}:${config.password}@${config.gitServer} master`)
                console.log("Successfully deployed!");
                return [2 /*return*/];
        }
    });
}); })();
