import * as vscode from 'vscode';
import { format } from 'date-fns';
import { siteId, setInterval, buildStatusColors } from './config';
import { netlifyEvents } from './netlify_eventemitter';

const deploySuccessfulTextColour = '#99ff99';
const errorTextColor = '#ffbc00';
const buildingTextColor = 'yellow';
const enqueuedTextColor = 'orange';

buildStatusColors.error = buildStatusColors.error || errorTextColor;
buildStatusColors.deploy_successful = buildStatusColors.deploy_successful || deploySuccessfulTextColour;
buildStatusColors.building = buildStatusColors.building || buildingTextColor;
buildStatusColors.enqueued = buildStatusColors.enqueued || enqueuedTextColor;

const buildStatus = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, -200);
const output = vscode.window.createOutputChannel('Netlify');

output.appendLine('Getting extension config from VS Code...\n');
output.appendLine(`Using [site_id]: ${siteId ? `"${siteId}"` : 'undefined'}`);
output.appendLine(`Using [set_interval]: ${setInterval}\n`);

if (!siteId) {
  output.appendLine(`Note: [site_id] is not located. No longer polling Netlify API 😿`);
}

const logOutputMessage = (message: string) => output.appendLine(`${siteId} [${format(new Date(), 'HH:mm:ss')}]: ${message}`);

netlifyEvents.on('startup', () => {
  logOutputMessage('Fetching deploy status...');

  buildStatus.text = '$(repo-sync~spin)  Netlify Build Status: Fetching deploy status...';
  buildStatus.color = new vscode.ThemeColor('statusBar.foreground');
  buildStatus.show();
});

netlifyEvents.on('ready', () => {
  logOutputMessage('Listening for build...');

  buildStatus.text = '$(repo-sync)  Netlify Build Status: Listening for build...';
  buildStatus.color = new vscode.ThemeColor('statusBar.foreground');
  buildStatus.show();
});

netlifyEvents.on('deploy-successful', ({ context }) => {
  logOutputMessage(`Deploy to ${context} was successful!`);

  buildStatus.text = `$(check)  Netlify Build Status: Deploy to ${context} was successful!`;
  buildStatus.color = buildStatusColors.deploy_successful;
  buildStatus.show();
});

netlifyEvents.on('building', ({ branch, context }) => {
  logOutputMessage(`${branch} is deploying to ${context}`);

  buildStatus.text = `$(repo-sync~spin)  Netlify Build Status: ${branch} is deploying to ${context}...`;
  buildStatus.color = buildStatusColors.building;
  buildStatus.show();
});

netlifyEvents.on('enqueued', ({ branch, context }) => {
  logOutputMessage(`${branch} is enqueued to deploy to ${context}`);

  buildStatus.text = `$(clock)  Netlify Build Status: ${branch} is waiting to deploy to ${context}...`;
  buildStatus.color = buildStatusColors.enqueued;
  buildStatus.show();
});

netlifyEvents.on('error', ({ branch, context }) => {
  logOutputMessage(`Failed to deploy ${branch} to ${context}`);

  buildStatus.text = `$(issue-opened)  Netlify Build Status: ${branch} failed to deploy to ${context}!`;
  buildStatus.color = buildStatusColors.error;
  buildStatus.show();
});

netlifyEvents.on('fetching-deploy-error', () => {
  logOutputMessage(`Failed to fetch deploy status. Stopping polling on Netlify Deploys API.`);

  buildStatus.text = `$(issue-opened)  Netlify Build Status: Failed to fetch deploy status`;
  buildStatus.color = buildStatusColors.error;
  buildStatus.show();
});
