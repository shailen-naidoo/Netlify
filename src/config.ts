import * as vscode from 'vscode';

interface BuildStatusColors {
  deploy_successful: string;
  building: string;
  enqueued: string;
  error: string;
}

const siteId = vscode.workspace.getConfiguration('netlify').get('site_id') as string;
const apiToken = vscode.workspace.getConfiguration('netlify').get('api_token') as string;
const setInterval = vscode.workspace.getConfiguration('netlify').get('set_interval') as number;
const buildHook = vscode.workspace.getConfiguration('netlify').get('build_hook') as string;
const buildStatusColors = vscode.workspace.getConfiguration('netlify').get('build_status_colors') as BuildStatusColors;

export {
  siteId,
  apiToken,
  setInterval,
  buildHook,
  buildStatusColors,
};