import * as vscode from 'vscode';
import { siteId } from './config';
import { netlifyEvents } from './netlify_eventemitter';

const statusBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, -100);
const output = vscode.window.createOutputChannel('Netlify');

netlifyEvents.on('startup', () => {
  output.appendLine(`${siteId}: Fetching deploy status...`);

  statusBar.text = '$(repo-sync~spin)  Netlify Build Status: Fetching deploy status...';
  statusBar.color = vscode.ThemeColor;
  statusBar.show();
});

netlifyEvents.on('ready', () => {
  output.appendLine(`${siteId}: Listening for build...`);

  statusBar.text = '$(repo-sync)  Netlify Build Status: Listening for build...';
  statusBar.color = vscode.ThemeColor;
  statusBar.show();
});

netlifyEvents.on('deploy-successful', ({ context }) => {
  statusBar.text = `$(check)  Netlify Build Status: Deploy to ${context} was successful!`;
  statusBar.color = '#99ff99';
  statusBar.show();
});

netlifyEvents.on('building', ({ branch, context }) => {
  output.appendLine(`${siteId}: ${branch} is deploying to ${context}`);

  statusBar.text = `$(repo-sync~spin)  Netlify Build Status: ${branch} is deploying to ${context}...`;
  statusBar.color = '#99ff99';
  statusBar.show();
});

netlifyEvents.on('enqueued', ({ branch, context }) => {
  output.appendLine(`${siteId}: ${branch} is enqueued to deploy to ${context}`);

  statusBar.text = `$(clock)  Netlify Build Status: ${branch} is enqueued to deploy to ${context}...`;
  statusBar.color = ' #99ff99';
  statusBar.show();
});

netlifyEvents.on('error', ({ branch, context }) => {
  output.appendLine(`${siteId}: Failed to deploy ${branch} to ${context}`);

  statusBar.text = `$(issue-opened)  Netlify Build Status: ${branch} failed to deploy to ${context}!`;
  statusBar.color = 'orange';
  statusBar.show();
});
