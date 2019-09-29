"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const netlify_eventemitter_1 = require("./netlify_eventemitter");
const statusBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, -100);
let deployUrl = '';
let productionSiteUrl = '';
netlify_eventemitter_1.netlifyEvents.on('*', (ctx) => {
    deployUrl = ctx.deploy_ssl_url;
    productionSiteUrl = ctx.url;
    statusBar.text = '$(globe)  View latest deploy';
    statusBar.command = 'netlify.viewLatestDeploy';
    statusBar.show();
});
netlify_eventemitter_1.netlifyEvents.once('*', () => {
    vscode.commands.registerCommand('netlify.viewLatestDeploy', () => {
        vscode.env.openExternal(vscode.Uri.parse(deployUrl));
    });
    vscode.commands.registerCommand('netlify.viewProductionSite', () => {
        vscode.env.openExternal(vscode.Uri.parse(productionSiteUrl));
    });
});
//# sourceMappingURL=netlify_commands.js.map