import axios from 'axios';
import * as EventEmitter from 'events';

interface Context {
  siteId: string;
  personalAccessToken: string;
}

const netlifyEvents = new EventEmitter();

const getNetlifyBuildStatus = async (ctx: Context) => {
  const { data: [buildStatus] } = await axios.get(`https://api.netlify.com/api/v1/sites/${ctx.siteId}/deploys`, {
    headers: ctx.personalAccessToken ? { 'Authorization': `Bearer ${ctx.personalAccessToken}` } : {}
  });

  return buildStatus;
};

export default (ctx: Context) => {
  setInterval(async () => {
    const buildStatus = await getNetlifyBuildStatus(ctx);
  
    if (buildStatus.state === 'ready') {
      netlifyEvents.emit('ready', buildStatus);
    }
  
    if (buildStatus.state === 'building') {
      netlifyEvents.emit('building', buildStatus);
    }
  
    if (buildStatus.state === 'enqueued') {
      netlifyEvents.emit('enqueued', buildStatus);
    }
  
  }, 10000);

  return netlifyEvents;
};