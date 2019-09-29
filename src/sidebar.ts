import * as vscode from 'vscode';
import axios from 'axios';
import { format } from 'date-fns';

class SidebarTreeItem extends vscode.TreeItem {
  constructor(title: string) {
    super(title);
  }
}

export class DataProvider {
  _onDidChangeTreeData = new vscode.EventEmitter();

  constructor() {
    // @ts-ignore
    this.onDidChangeTreeData = this._onDidChangeTreeData.event;
  }

  async getChildren() {
    const { data } = await axios.get('https://api.netlify.com/api/v1/sites/readme-fm.netlify.com/deploys');
    
    // @ts-ignore
    return data.map((deploy, index) => new SidebarTreeItem(`${index + 1} - ${deploy.title || 'Triggered build on Netlify'}`));
  }

  getTreeItem(element: SidebarTreeItem) {
    return element;
  }

  refresh() {
    this._onDidChangeTreeData.fire();
  }
}

const deploysDataProvider = new DataProvider();

vscode.window.registerTreeDataProvider('deploys', deploysDataProvider);

deploysDataProvider._onDidChangeTreeData.fire();