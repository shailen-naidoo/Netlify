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
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const axios_1 = require("axios");
class SidebarTreeItem extends vscode.TreeItem {
    constructor(title) {
        super(title);
    }
}
class DataProvider {
    constructor() {
        this._onDidChangeTreeData = new vscode.EventEmitter();
        // @ts-ignore
        this.onDidChangeTreeData = this._onDidChangeTreeData.event;
    }
    getChildren() {
        return __awaiter(this, void 0, void 0, function* () {
            const { data } = yield axios_1.default.get('https://api.netlify.com/api/v1/sites/readme-fm.netlify.com/deploys');
            // @ts-ignore
            return data.map((deploy, index) => new SidebarTreeItem(`${index + 1} - ${deploy.title || 'Triggered build on Netlify'}`));
        });
    }
    getTreeItem(element) {
        return element;
    }
    refresh() {
        this._onDidChangeTreeData.fire();
    }
}
exports.DataProvider = DataProvider;
const deploysDataProvider = new DataProvider();
vscode.window.registerTreeDataProvider('deploys', deploysDataProvider);
deploysDataProvider._onDidChangeTreeData.fire();
//# sourceMappingURL=sidebar.js.map