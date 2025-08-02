import * as vscode from 'vscode';
import * as path from 'path';
import { netlifyEvents } from './netlify_eventemitter';

class DeploySummaryItem extends vscode.TreeItem {
  constructor(title: string) {
    super(title);
  }

  // @ts-ignore
  iconPath = {
    dark: path.join(__filename, '..', '..', 'resources', 'done.dark.svg'),
    light: path.join(__filename, '..', '..', 'resources', 'done.light.svg'),
  };

  contextValue = 'deploy-summary';
}

export class DataProvider implements vscode.TreeDataProvider<DeploySummaryItem> {
  _onDidChangeTreeData = new vscode.EventEmitter();

  constructor() {
    // @ts-ignore
    this.onDidChangeTreeData = this._onDidChangeTreeData.event;
  }

  getChildren(): DeploySummaryItem[] {
    return [
      new DeploySummaryItem('No deploy summary')
    ];
  }

  // @ts-ignore
  getTreeItem(element: DeploySummaryItem) {
    return element;
  }

  refresh() {
    this._onDidChangeTreeData.fire(true);
  }
}

const deploysDataProvider = new DataProvider();

// @ts-ignore
vscode.window.registerTreeDataProvider('deploy-summary', deploysDataProvider);

// netlifyEvents.on('ready', ({ summary: { messages = [] }}) => {
//   if (messages.length) {
//     deploysDataProvider.getChildren = () => messages.map(
//       ({ title }: { title: string }) => new DeploySummaryItem(title)
//     );
//   }

//   vscode.window.registerTreeDataProvider('deploy-summary', deploysDataProvider);
// });

// netlifyEvents.on('deploy-successful', ({ summary: { messages }}) => {
//   // @ts-ignore
//   deploysDataProvider.getChildren = () => new Promise((resolve) => {
//     setTimeout(() => {
//       resolve(messages.map(
//         ({ title }: { title: string }) => new DeploySummaryItem(title)
//       ));
//     }, 2000);
//   });

//   deploysDataProvider._onDidChangeTreeData.fire(true);
// });
