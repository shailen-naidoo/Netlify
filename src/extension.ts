import * as vscode from 'vscode';
import * as config from './config';
import * as Netlify from './netlify_eventemitter';
import './netlify_eventobserver';

export const activate = async (context: vscode.ExtensionContext) => {
  await Netlify.start(config);
};

export function deactivate() {}