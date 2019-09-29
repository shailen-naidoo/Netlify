"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const netlify_eventemitter_1 = require("./netlify_eventemitter");
let deployUrl = '';
netlify_eventemitter_1.netlifyEvents.on('*', (ctx) => {
    deployUrl = ctx.deploy_ssl_url;
});
vscode.commands.registerCommand('netlify.viewLatestDeploy', () => {
    vscode.env.openExternal(vscode.Uri.parse(deployUrl));
});
//# sourceMappingURL=commands.js.map