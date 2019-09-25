import * as vscode from 'vscode';
import { format } from 'date-fns';
import { siteId, apiToken, setInterval } from './config';
import { netlifyEvents } from './netlify_eventemitter';

const statusBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, -100);
const output = vscode.window.createOutputChannel('Netlify');

output.appendLine('Getting extension config from VS Code...\n');
output.appendLine(`Using [site_id]: ${siteId ? `"${siteId}"` : 'undefined'}`);
output.appendLine(`Using [api_token]: "${apiToken}"`);
output.appendLine(`Using [set_interval]: ${setInterval}\n`);

if (!siteId) {
  output.appendLine(`Note: [site_id] is not located. No longer polling Netlify API 😿`);
}

const logOutputMessage = (message: string) => output.appendLine(`${siteId} [${format(new Date(), 'HH:mm:ss')}]: ${message}`);

netlifyEvents.on('startup', () => {
  logOutputMessage('Fetching deploy status...');

  statusBar.text = '$(repo-sync~spin)  Netlify Build Status: Fetching deploy status...';
  statusBar.color = vscode.ThemeColor;
  statusBar.show();
});

netlifyEvents.on('ready', () => {
  logOutputMessage('Listening for build...');

  statusBar.text = '$(repo-sync)  Netlify Build Status: Listening for build...';
  statusBar.color = vscode.ThemeColor;
  statusBar.show();
});

netlifyEvents.on('deploy-successful', ({ context }) => {
  logOutputMessage(`Deploy to ${context} was successful!`);

  statusBar.text = `$(check)  Netlify Build Status: Deploy to ${context} was successful!`;
  statusBar.color = '#99ff99';
  statusBar.show();
});

netlifyEvents.on('building', ({ branch, context }) => {
  logOutputMessage(`${branch} is deploying to ${context}`);

  statusBar.text = `$(repo-sync~spin)  Netlify Build Status: ${branch} is deploying to ${context}...`;
  statusBar.color = 'yellow';
  statusBar.show();
});

netlifyEvents.on('enqueued', ({ branch, context }) => {
  logOutputMessage(`${branch} is enqueued to deploy to ${context}`);

  statusBar.text = `$(clock)  Netlify Build Status: ${branch} is waiting to deploy to ${context}...`;
  statusBar.color = 'orange';
  statusBar.show();
});

netlifyEvents.on('error', ({ branch, context }) => {
  logOutputMessage(`Failed to deploy ${branch} to ${context}`);

  statusBar.text = `$(issue-opened)  Netlify Build Status: ${branch} failed to deploy to ${context}!`;
  statusBar.color = 'red';
  statusBar.show();
});
