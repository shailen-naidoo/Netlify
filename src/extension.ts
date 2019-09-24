import * as vscode from 'vscode';
import axios from 'axios';
import { differenceInSeconds } from 'date-fns';
import NetlifyEvents from './netlify_build_status';

const statusBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, -100);

const siteId = vscode.workspace.getConfiguration('netlify').get('site_id') as string;
const personalAccessToken = vscode.workspace.getConfiguration('netlify').get('api_token') as string;

const netlifyEvents = NetlifyEvents({
  siteId,
  personalAccessToken,
});

const output = vscode.window.createOutputChannel('Netlify');

export const activate = async (context: vscode.ExtensionContext) => {

  netlifyEvents.on('ready', ({ context, publishedAt }) => {
    const deployTime = publishedAt ? differenceInSeconds(new Date(), new Date(publishedAt)) : 100;

    if (deployTime < 20) {
      statusBar.text = `$(check)  Netlify Build Status: Deploy to ${context} was successful!`;
      statusBar.color = '#99ff99';
      statusBar.show();
      return;
    }

    output.appendLine(`${siteId}: Listening for build...`);

    statusBar.text = '$(repo-sync)  Netlify Build Status: Listening for build...';
    statusBar.color = vscode.ThemeColor;
    statusBar.show();
    return;
  });

  netlifyEvents.on('building', ({ branch, context }) => {
    output.appendLine(`${siteId}: ${branch} is deploying to ${context}`);

    statusBar.text = `$(repo-sync~spin)  Netlify Build Status: ${branch} is deploying to ${context}...`;
    statusBar.color = '#99ff99';
    statusBar.show();
    return;
  });

  netlifyEvents.on('enqueued', ({ state, branch, context }) => {
    if (state === 'enqueued') {
      output.appendLine(`${siteId}: ${branch} is enqueued to deploy to ${context}`);

      statusBar.text = `$(clock)  Netlify Build Status: ${branch} is enqueued to deploy to ${context}...`;
      statusBar.color = ' #99ff99';
      statusBar.show();
      return;
    }
  });

  netlifyEvents.on('error', ({ branch, context }) => {
    output.appendLine(`${siteId}: Failed to deploy ${branch} to ${context}`);

    statusBar.text = `$(issue-opened)  Netlify Build Status: ${branch} failed to deploy to ${context}!`;
    statusBar.color = 'orange';
    statusBar.show();
    return;
  });
};

export function deactivate() {}