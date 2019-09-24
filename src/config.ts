import * as vscode from 'vscode';

const siteId = vscode.workspace.getConfiguration('netlify').get('site_id') as string;
const apiToken = vscode.workspace.getConfiguration('netlify').get('api_token') as string;
const setInterval = vscode.workspace.getConfiguration('netlify').get('set_interval') as number;

export {
  siteId,
  apiToken,
  setInterval,
};