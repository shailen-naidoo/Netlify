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
const child = require("child_process");
const util_1 = require("util");
const netlify_eventemitter_1 = require("./netlify_eventemitter");
const statusBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, -100);
let deployUrl = '';
let productionSiteUrl = '';
// @ts-ignore
const getWorkspaceRootPath = () => vscode.workspace.workspaceFolders[0].uri.fsPath;
const exec = util_1.promisify(child.exec);
netlify_eventemitter_1.netlifyEvents.on('*', (ctx) => {
    productionSiteUrl = ctx.url;
});
netlify_eventemitter_1.netlifyEvents.on('all-deploys', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const { stdout: branch } = yield exec('git rev-parse --abbrev-ref HEAD', { cwd: getWorkspaceRootPath() });
    const buildStatus = ctx.find((deploy) => deploy.branch === branch.trim());
    if (!buildStatus) {
        statusBar.text = '$(globe)  No deploy for current branch';
        statusBar.command = undefined;
        statusBar.tooltip = `Please create a PR to view deploy preview`;
        statusBar.show();
        return;
    }
    deployUrl = buildStatus.deploy_ssl_url;
    statusBar.text = '$(globe)  View latest Netlify deploy';
    statusBar.command = 'netlify.viewLatestDeploy';
    statusBar.tooltip = `View the latest deploy for ${branch}`;
    statusBar.show();
}));
netlify_eventemitter_1.netlifyEvents.once('*', () => {
    vscode.commands.registerCommand('netlify.viewLatestDeploy', () => {
        vscode.env.openExternal(vscode.Uri.parse(deployUrl));
    });
    vscode.commands.registerCommand('netlify.viewProductionSite', () => {
        vscode.env.openExternal(vscode.Uri.parse(productionSiteUrl));
    });
});
//# sourceMappingURL=netlify_commands.js.map