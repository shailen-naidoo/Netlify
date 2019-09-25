"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const date_fns_1 = require("date-fns");
const config_1 = require("./config");
const netlify_eventemitter_1 = require("./netlify_eventemitter");
const statusBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, -100);
const output = vscode.window.createOutputChannel('Netlify');
output.appendLine(`Using [site_id]: "${config_1.siteId}"`);
output.appendLine(`Using [api_token]: "${config_1.apiToken}"`);
output.appendLine(`Using [set_interval]: ${config_1.setInterval}\n`);
const logOutputMessage = (message) => output.appendLine(`${config_1.siteId} [${date_fns_1.format(new Date(), 'HH:mm:ss')}]: ${message}`);
netlify_eventemitter_1.netlifyEvents.on('startup', () => {
    logOutputMessage('Fetching deploy status...');
    statusBar.text = '$(repo-sync~spin)  Netlify Build Status: Fetching deploy status...';
    statusBar.color = vscode.ThemeColor;
    statusBar.show();
});
netlify_eventemitter_1.netlifyEvents.on('ready', () => {
    logOutputMessage('Listening for build...');
    statusBar.text = '$(repo-sync)  Netlify Build Status: Listening for build...';
    statusBar.color = vscode.ThemeColor;
    statusBar.show();
});
netlify_eventemitter_1.netlifyEvents.on('deploy-successful', ({ context }) => {
    logOutputMessage(`Deploy to ${context} was successful!`);
    statusBar.text = `$(check)  Netlify Build Status: Deploy to ${context} was successful!`;
    statusBar.color = '#99ff99';
    statusBar.show();
});
netlify_eventemitter_1.netlifyEvents.on('building', ({ branch, context }) => {
    logOutputMessage(`${branch} is deploying to ${context}`);
    statusBar.text = `$(repo-sync~spin)  Netlify Build Status: ${branch} is deploying to ${context}...`;
    statusBar.color = 'yellow';
    statusBar.show();
});
netlify_eventemitter_1.netlifyEvents.on('enqueued', ({ branch, context }) => {
    logOutputMessage(`${branch} is enqueued to deploy to ${context}`);
    statusBar.text = `$(clock)  Netlify Build Status: ${branch} is waiting to deploy to ${context}...`;
    statusBar.color = 'orange';
    statusBar.show();
});
netlify_eventemitter_1.netlifyEvents.on('error', ({ branch, context }) => {
    logOutputMessage(`Failed to deploy ${branch} to ${context}`);
    statusBar.text = `$(issue-opened)  Netlify Build Status: ${branch} failed to deploy to ${context}!`;
    statusBar.color = 'red';
    statusBar.show();
});
//# sourceMappingURL=netlify_eventobserver.js.map