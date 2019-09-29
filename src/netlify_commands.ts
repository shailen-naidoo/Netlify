import * as vscode from 'vscode';
import { netlifyEvents } from './netlify_eventemitter';

const statusBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, -100);

let deployUrl: string = '';
let productionSiteUrl: string = '';

netlifyEvents.on('*', (ctx) => {
  deployUrl = ctx.deploy_ssl_url;
  productionSiteUrl = ctx.url;

  statusBar.text = '$(globe)  View latest deploy';
  statusBar.command = 'netlify.viewLatestDeploy';
  statusBar.show();
});

netlifyEvents.once('*', () => {
  vscode.commands.registerCommand('netlify.viewLatestDeploy', () => {
    vscode.env.openExternal(vscode.Uri.parse(deployUrl));
  });
  
  vscode.commands.registerCommand('netlify.viewProductionSite', () => {
    vscode.env.openExternal(vscode.Uri.parse(productionSiteUrl));
  });
});
  