"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const date_fns_1 = require("date-fns");
const config_1 = require("./config");
const netlify_eventemitter_1 = require("./netlify_eventemitter");
const buildStatus = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, -200);
const output = vscode.window.createOutputChannel('Netlify');
output.appendLine('Getting extension config from VS Code...\n');
output.appendLine(`Using [site_id]: ${config_1.siteId ? `"${config_1.siteId}"` : 'undefined'}`);
output.appendLine(`Using [api_token]: "${config_1.apiToken}"`);
output.appendLine(`Using [set_interval]: ${config_1.setInterval}\n`);
if (!config_1.siteId) {
    output.appendLine(`Note: [site_id] is not located. No longer polling Netlify API 😿`);
}
const logOutputMessage = (message) => output.appendLine(`${config_1.siteId} [${date_fns_1.format(new Date(), 'HH:mm:ss')}]: ${message}`);
netlify_eventemitter_1.netlifyEvents.on('startup', () => {
    logOutputMessage('Fetching deploy status...');
    buildStatus.text = '$(repo-sync~spin)  Netlify Build Status: Fetching deploy status...';
    buildStatus.color = vscode.ThemeColor;
    buildStatus.show();
});
netlify_eventemitter_1.netlifyEvents.on('ready', () => {
    logOutputMessage('Listening for build...');
    buildStatus.text = '$(repo-sync)  Netlify Build Status: Listening for build...';
    buildStatus.color = vscode.ThemeColor;
    buildStatus.show();
});
netlify_eventemitter_1.netlifyEvents.on('deploy-successful', ({ context }) => {
    logOutputMessage(`Deploy to ${context} was successful!`);
    buildStatus.text = `$(check)  Netlify Build Status: Deploy to ${context} was successful!`;
    buildStatus.color = '#99ff99';
    buildStatus.show();
});
netlify_eventemitter_1.netlifyEvents.on('building', ({ branch, context }) => {
    logOutputMessage(`${branch} is deploying to ${context}`);
    buildStatus.text = `$(repo-sync~spin)  Netlify Build Status: ${branch} is deploying to ${context}...`;
    buildStatus.color = 'yellow';
    buildStatus.show();
});
netlify_eventemitter_1.netlifyEvents.on('enqueued', ({ branch, context }) => {
    logOutputMessage(`${branch} is enqueued to deploy to ${context}`);
    buildStatus.text = `$(clock)  Netlify Build Status: ${branch} is waiting to deploy to ${context}...`;
    buildStatus.color = 'orange';
    buildStatus.show();
});
netlify_eventemitter_1.netlifyEvents.on('error', ({ branch, context }) => {
    logOutputMessage(`Failed to deploy ${branch} to ${context}`);
    buildStatus.text = `$(issue-opened)  Netlify Build Status: ${branch} failed to deploy to ${context}!`;
    buildStatus.color = 'red';
    buildStatus.show();
});
netlify_eventemitter_1.netlifyEvents.on('fetching-deploy-error', () => {
    logOutputMessage(`Failed to fetch deploy status. Stopping polling on Netlify Deploys API.`);
    buildStatus.text = `$(issue-opened)  Netlify Build Status: Failed to fetch deploy status`;
    buildStatus.color = 'red';
    buildStatus.show();
});
//# sourceMappingURL=netlify_eventobserver.js.map