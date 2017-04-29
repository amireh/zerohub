const createStubbableFunction = require('utils/createStubbableFunction');
const fetch = require('utils/fetch');

const APP_ENV = electronRequire('electron').remote.getGlobal('APP_ENV');
const API_HOST = APP_ENV.API_HOST || 'http://localhost:3000';
let apiToken = APP_ENV.API_TOKEN;

exports.setApiToken = function(nextToken) {
  apiToken = nextToken;
};

exports.request = createStubbableFunction(function request(params) {
  return fetch(Object.assign({}, params, {
    url: `${API_HOST}${params.url}`,
    method: params.method || 'GET',
    body: params.body ? JSON.stringify(params.body) : undefined,
    headers: Object.assign({}, params.headers, {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': apiToken ? `Basic ${apiToken}` : null,
      'X-0-Hub': '1'
    })
  }))
});
