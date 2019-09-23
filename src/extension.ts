import * as vscode from 'vscode';
import axios from 'axios';
import { differenceInSeconds } from 'date-fns';

const output = vscode.window.createOutputChannel('Netlify');

export const activate = async (context: vscode.ExtensionContext) => {

  const statusBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, -100);
  const siteId = vscode.workspace.getConfiguration('netlify').get('site_id') as string;
  const personalAccessToken = vscode.workspace.getConfiguration('netlify').get('api_token');

  const init = async () => {
    output.appendLine(`${siteId}: Fetching deploy status`);

    statusBar.text = '$(repo-sync~spin)  Netlify Build Status: Fetching deploy status...';
    statusBar.color = vscode.ThemeColor;
    statusBar.show();

    try {
      const { data: [buildStatus] } = await axios.get(`https://api.netlify.com/api/v1/sites/${siteId}/deploys`, {
        headers: {
          ...personalAccessToken ? { 'Authorization': `Bearer ${personalAccessToken}` } : {},
        }
      });

      updateStatusBar({
        state: buildStatus.state,
        branch: buildStatus.branch,
        context: buildStatus.context,
        publishedAt: buildStatus.published_at,
      });
    } catch (e) {
      output.clear();
      output.appendLine(`${siteId}: Project not authorized`);

      statusBar.text = '$(issue-opened)  Netlify Build Status: Cannot fetch build status, project unauthorized';
      statusBar.color = 'orange';
      statusBar.show();

      return true;
    }
  };

  const updateStatusBar = ({ state, branch, context, publishedAt }: { state: string; branch: string; context: string; publishedAt: string | null }) => {

    if (state === 'ready') {
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
    }

    if (state === 'building') {
      output.appendLine(`${siteId}: ${branch} is deploying to ${context}`);

      statusBar.text = `$(repo-sync~spin)  Netlify Build Status: ${branch} is deploying to ${context}...`;
      statusBar.color = '#99ff99';
      statusBar.show();
      return;
    }

    if (state === 'enqueued') {
      output.appendLine(`${siteId}: ${branch} is enqueued to deploy to ${context}`);

      statusBar.text = `$(clock)  Netlify Build Status: ${branch} is enqueued to deploy to ${context}...`;
      statusBar.color = ' #99ff99';
      statusBar.show();
      return;
    }

    if (state === 'error') {
      output.appendLine(`${siteId}: Failed to deploy ${branch} to ${context}`);

      statusBar.text = `$(issue-opened)  Netlify Build Status: ${branch} failed to deploy to ${context}!`;
      statusBar.color = 'orange';
      statusBar.show();
      return;
    }
  };

  const fetchNetlifyBuildStatus = () => {
    setInterval(async (): Promise<void> => {
      const { data: [buildStatus] } = await axios.get(`https://api.netlify.com/api/v1/sites/${siteId}/deploys`, {
        headers: {
          ...personalAccessToken ? { 'Authorization': `Bearer ${personalAccessToken}` } : {},
        }
      });
  
      updateStatusBar({
        state: buildStatus.state,
        branch: buildStatus.branch,
        context: buildStatus.context,
        publishedAt: buildStatus.published_at,
      });
    }, 10000);
  };

  const main = async () => {
    const res = await init();

    if (res) {
      return;
    }

    fetchNetlifyBuildStatus();
  };

  if(!siteId) {
    return;
  }

  main();
};

export function deactivate() {}
