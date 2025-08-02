import * as vscode from 'vscode';
import * as config from './config';
import * as Netlify from './netlify_eventemitter';
import './netlify_eventobserver';
import './netlify_commands';
// import './sidebar';

export const activate = async (context: vscode.ExtensionContext) => {
  if (!config.siteId) {
    return;
  }

  const apiToken = await context.secrets.get('netlify_api_token');

  if (!apiToken) {
    vscode.window.showErrorMessage('Run "Netlify: Set API Token" command to set your Netlify API token.');
    return;
  }

  vscode.commands.registerCommand('netlify.setApiToken', async () => {
    const token = await vscode.window.showInputBox({
      prompt: 'Enter your Netlify API token',
      placeHolder: 'Netlify API Token',
      password: true,
      validateInput: (value: string) => {
        if (!value) {
          return 'API token cannot be empty';
        }
        return null;
      }
    });

    if (token) {
      await context.secrets.store('netlify_api_token', token)
      await vscode.window.showInformationMessage('Netlify API token set successfully!');
    }
  });

  await Netlify.start({ ...config, apiToken });
};

export function deactivate() { }