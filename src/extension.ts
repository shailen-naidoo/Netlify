import * as vscode from 'vscode';
import * as config from './config';
import * as Netlify from './netlify_eventemitter';
import './netlify_eventobserver';
import './netlify_commands';

export const activate = async (context: vscode.ExtensionContext) => {
  if (!config.siteId) {
    return;
  }

  await Netlify.start(config);
};

export function deactivate() {}