import * as vscode from 'vscode';
import { format } from 'date-fns';
import { siteId, apiToken, setInterval } from './config';
import { netlifyEvents } from './netlify_eventemitter';

const buildStatus = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, -200);
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

  buildStatus.text = '$(repo-sync~spin)  Netlify Build Status: Fetching deploy status...';
  buildStatus.show();
});

netlifyEvents.on('ready', () => {
  logOutputMessage('Listening for build...');

  buildStatus.text = '$(repo-sync)  Netlify Build Status: Listening for build...';
  buildStatus.show();
});

netlifyEvents.on('deploy-successful', ({ context }) => {
  logOutputMessage(`Deploy to ${context} was successful!`);

  buildStatus.text = `$(check)  Netlify Build Status: Deploy to ${context} was successful!`;
  buildStatus.color = '#99ff99';
  buildStatus.show();
});

netlifyEvents.on('building', ({ branch, context }) => {
  logOutputMessage(`${branch} is deploying to ${context}`);

  buildStatus.text = `$(repo-sync~spin)  Netlify Build Status: ${branch} is deploying to ${context}...`;
  buildStatus.color = 'yellow';
  buildStatus.show();
});

netlifyEvents.on('enqueued', ({ branch, context }) => {
  logOutputMessage(`${branch} is enqueued to deploy to ${context}`);

  buildStatus.text = `$(clock)  Netlify Build Status: ${branch} is waiting to deploy to ${context}...`;
  buildStatus.color = 'orange';
  buildStatus.show();
});

netlifyEvents.on('error', ({ branch, context }) => {
  logOutputMessage(`Failed to deploy vscode.ThemeColor${branch} to ${context}`);

  buildStatus.text = `$(issue-opened)  Netlify Build Status: ${branch} failed to deploy to ${context}!`;
  buildStatus.color = 'red';
  buildStatus.show();
});

netlifyEvents.on('fetching-deploy-error', () => {
  logOutputMessage(`Failed to fetch deploy status. Stopping polling on Netlify Deploys API.`);

  buildStatus.text = `$(issue-opened)  Netlify Build Status: Failed to fetch deploy status`;
  buildStatus.color = 'red';
  buildStatus.show();
});
