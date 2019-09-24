"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const siteId = vscode.workspace.getConfiguration('netlify').get('site_id');
exports.siteId = siteId;
const apiToken = vscode.workspace.getConfiguration('netlify').get('api_token');
exports.apiToken = apiToken;
//# sourceMappingURL=config.js.map