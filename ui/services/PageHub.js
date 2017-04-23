import createStubbableFunction from 'utils/createStubbableFunction';
import fetch from 'utils/fetch';

const APP_ENV = electronRequire('electron').remote.getGlobal('APP_ENV');
const API_HOST = process.env.API_HOST || 'http://localhost:3000';

export const request = createStubbableFunction(function request(params) {
  const requestOptions = Object.assign({}, params, {
    url: `${API_HOST}${params.url}`,
    method: params.method || 'GET',
    body: params.body ? JSON.stringify(params.body) : undefined,
    headers: Object.assign({}, params.headers, {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Basic ${APP_ENV.API_TOKEN}`,
      'X-0-Hub': '1'
    })
  });

  return fetch(requestOptions).then(payload => {
    if (process.env.NODE_ENV === 'development') {
      console.debug('PH Request: %s', `[${requestOptions.method}] ${requestOptions.url}`, payload);
    }

    return payload;
  });
});
