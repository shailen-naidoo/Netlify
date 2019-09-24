import * as vscode from 'vscode';

const siteId = vscode.workspace.getConfiguration('netlify').get('site_id') as string;
const apiToken = vscode.workspace.getConfiguration('netlify').get('api_token') as string;

export {
  siteId,
  apiToken,
};