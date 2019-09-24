import axios from 'axios';
import * as EventEmitter from 'events';
import { differenceInSeconds } from 'date-fns';

interface Context {
  siteId: string;
  apiToken: string;
}

const netlifyEvents = new EventEmitter();

const getNetlifyBuildStatus = async (ctx: Context) => {
  const { data: [buildStatus] } = await axios.get(`https://api.netlify.com/api/v1/sites/${ctx.siteId}/deploys`, {
    headers: ctx.apiToken ? { 'Authorization': `Bearer ${ctx.apiToken}` } : {}
  });

  return buildStatus;
};

const start = async (ctx: Context) => {
  netlifyEvents.emit('startup');

  await getNetlifyBuildStatus(ctx).then(({ state }) => netlifyEvents.emit(state));

  setInterval(async () => {
    const buildStatus = await getNetlifyBuildStatus(ctx);

    if (buildStatus.state === 'ready') {
      const deployTime = buildStatus.published_at ? differenceInSeconds(new Date(), new Date(buildStatus.published_at)) : 100;

      if (deployTime < 20) {
        netlifyEvents.emit('deploy-successful', buildStatus);
        return;
      }

      netlifyEvents.emit('ready', buildStatus);
    }
  
    if (buildStatus.state === 'building') {
      netlifyEvents.emit('building', buildStatus);
    }
  
    if (buildStatus.state === 'enqueued') {
      netlifyEvents.emit('enqueued', buildStatus);
    }
  
  }, 15000);
};

export {
  netlifyEvents,
  start,
};