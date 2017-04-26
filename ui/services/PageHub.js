const createStubbableFunction = require('utils/createStubbableFunction');
const fetch = require('utils/fetch');

const APP_ENV = electronRequire('electron').remote.getGlobal('APP_ENV');
const API_HOST = process.env.API_HOST || 'http://localhost:3000';

exports.request = createStubbableFunction(function request(params) {
  return fetch(Object.assign({}, params, {
    url: `${API_HOST}${params.url}`,
    method: params.method || 'GET',
    body: params.body ? JSON.stringify(params.body) : undefined,
    headers: Object.assign({}, params.headers, {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Basic ${APP_ENV.API_TOKEN}`,
      'X-0-Hub': '1'
    })
  }));
});
