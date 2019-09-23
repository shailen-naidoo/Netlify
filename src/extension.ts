import * as vscode from 'vscode';
import axios from 'axios';
import { differenceInSeconds } from 'date-fns';

export const activate = async (context: vscode.ExtensionContext) => {
  console.log('Netlify Activated');
  const statusBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, -100);
  const siteId = vscode.workspace.getConfiguration('netlify').get('site_id');

  const init = async () => {
    statusBar.text = '$(repo-sync~spin)  Netlify Build Status: Fetching deploy status...';
    statusBar.color = 'white';
    statusBar.show();

    try {
      const { data: [buildStatus] } = await axios.get(`https://api.netlify.com/api/v1/sites/${siteId}/deploys`);

      updateStatusBar({
        state: buildStatus.state,
        branch: buildStatus.branch,
        context: buildStatus.context,
        publishedAt: buildStatus.published_at,
      });
    } catch (e) {
      statusBar.text = '$(issue-opened)  Netlify Build Status: Cannot fetch build status, project unauthorized';
      statusBar.color = 'orange';
      statusBar.show();

      return true;
    }
  };

  const updateStatusBar = ({ state, branch, context, publishedAt }: { state: string; branch: string; context: string; publishedAt: string | null }) => {

    if (state === 'ready') {
      const deployTime = publishedAt ? differenceInSeconds(new Date(), new Date(publishedAt)) : 100;

      if (deployTime < 30) {
        statusBar.text = `$(check)  Netlify Build Status: Deploy to ${context} was successful!`;
        statusBar.color = '#99ff99';
        statusBar.show();
        return;
      } 

      statusBar.text = '$(repo-sync)  Netlify Build Status: Listening for build...';
      statusBar.color = 'white';
      statusBar.show();
      return;
    }

    if (state === 'building') {
      statusBar.text = `$(repo-sync~spin)  Netlify Build Status: ${branch} is deploying to ${context}...`;
      statusBar.color = '#99ff99';
      statusBar.show();
      return;
    }

    if (state === 'enqueued') {
      statusBar.text = `$(clock)  Netlify Build Status: ${branch} is enqueued to deploy to ${context}...`;
      statusBar.color = ' #99ff99';
      statusBar.show();
      return;
    }

    if (state === 'error') {
      statusBar.text = `$(issue-opened)  Netlify Build Status: ${branch} failed to deploy to ${context}!`;
      statusBar.color = 'orange';
      statusBar.show();
      return;
    }
  };

  const fetchNetlifyBuildStatus = () => {
    setInterval(async (): Promise<void> => {
      const { data: [buildStatus] } = await axios.get(`https://api.netlify.com/api/v1/sites/${siteId}/deploys`);
  
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
