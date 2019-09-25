"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = require("axios");
const EventEmitter = require("events");
const date_fns_1 = require("date-fns");
const netlifyEvents = new EventEmitter();
const getNetlifyBuildStatus = (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const { data: [buildStatus] } = yield axios_1.default.get(`https://api.netlify.com/api/v1/sites/${ctx.siteId}/deploys`, {
        headers: ctx.personalAccessToken ? { 'Authorization': `Bearer ${ctx.personalAccessToken}` } : {}
    });
    return buildStatus;
});
exports.default = (ctx) => {
    getNetlifyBuildStatus(ctx).then(({ state }) => netlifyEvents.emit(state));
    setInterval(() => __awaiter(void 0, void 0, void 0, function* () {
        const buildStatus = yield getNetlifyBuildStatus(ctx);
        if (buildStatus.state === 'ready') {
            const deployTime = buildStatus.publishedAt ? date_fns_1.differenceInSeconds(new Date(), new Date(buildStatus.publishedAt)) : 100;
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
    }), 10000);
    return netlifyEvents;
};
//# sourceMappingURL=netlify_build_status.js.map