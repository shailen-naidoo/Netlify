"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const config_1 = require("./config");
const netlify_eventemitter_1 = require("./netlify_eventemitter");
const statusBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, -100);
const output = vscode.window.createOutputChannel('Netlify');
netlify_eventemitter_1.netlifyEvents.on('startup', () => {
    output.appendLine(`${config_1.siteId}: Fetching deploy status...`);
    statusBar.text = '$(repo-sync~spin)  Netlify Build Status: Fetching deploy status...';
    statusBar.color = vscode.ThemeColor;
    statusBar.show();
});
netlify_eventemitter_1.netlifyEvents.on('ready', () => {
    output.appendLine(`${config_1.siteId}: Listening for build...`);
    statusBar.text = '$(repo-sync)  Netlify Build Status: Listening for build...';
    statusBar.color = vscode.ThemeColor;
    statusBar.show();
});
netlify_eventemitter_1.netlifyEvents.on('deploy-successful', ({ context }) => {
    statusBar.text = `$(check)  Netlify Build Status: Deploy to ${context} was successful!`;
    statusBar.color = '#99ff99';
    statusBar.show();
});
netlify_eventemitter_1.netlifyEvents.on('building', ({ branch, context }) => {
    output.appendLine(`${config_1.siteId}: ${branch} is deploying to ${context}`);
    statusBar.text = `$(repo-sync~spin)  Netlify Build Status: ${branch} is deploying to ${context}...`;
    statusBar.color = '#99ff99';
    statusBar.show();
});
netlify_eventemitter_1.netlifyEvents.on('enqueued', ({ branch, context }) => {
    output.appendLine(`${config_1.siteId}: ${branch} is enqueued to deploy to ${context}`);
    statusBar.text = `$(clock)  Netlify Build Status: ${branch} is enqueued to deploy to ${context}...`;
    statusBar.color = ' #99ff99';
    statusBar.show();
});
netlify_eventemitter_1.netlifyEvents.on('error', ({ branch, context }) => {
    output.appendLine(`${config_1.siteId}: Failed to deploy ${branch} to ${context}`);
    statusBar.text = `$(issue-opened)  Netlify Build Status: ${branch} failed to deploy to ${context}!`;
    statusBar.color = 'orange';
    statusBar.show();
});
//# sourceMappingURL=netlify_eventobserver.js.map