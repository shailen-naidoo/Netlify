import axios from 'axios';
import * as EventEmitter from 'events';
import { differenceInSeconds } from 'date-fns';

interface Context {
  siteId: string;
  apiToken: string;
  setInterval: number;
}

const netlifyEvents = new EventEmitter();

const getNetlifyBuildStatus = async (ctx: Context) => {
  const { data } = await axios.get(`https://api.netlify.com/api/v1/sites/${ctx.siteId}/deploys`, {
    headers: ctx.apiToken ? { 'Authorization': `Bearer ${ctx.apiToken}` } : {}
  });

  return data;
};

const start = async (ctx: Context) => {
  let interval: NodeJS.Timeout;

  netlifyEvents.emit('startup');

  const [, err] = await getNetlifyBuildStatus(ctx).then((buildEvents) => {
    const [buildStatus] = buildEvents;

    netlifyEvents.emit('*', buildStatus);
    netlifyEvents.emit('all-deploys', buildEvents);
    netlifyEvents.emit(buildStatus.state, buildStatus);

    return [buildStatus, undefined];
  }).catch(err => {
    return [undefined, err];
  });

  if (err) {
    netlifyEvents.emit('fetching-deploy-error', err);
    return 0;
  }

  setInterval(async () => {
    const buildEvents = await getNetlifyBuildStatus(ctx);
    const [buildStatus] = buildEvents;

    netlifyEvents.emit('*', buildStatus);
    netlifyEvents.emit('all-deploys', buildEvents);

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

    if (buildStatus.state === 'error') {
      netlifyEvents.emit('error', buildStatus);
    }
  
  }, ctx.setInterval);
};

export {
  netlifyEvents,
  start,
};