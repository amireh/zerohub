import createStubbableFunction from 'utils/createStubbableFunction';

const nodeRequest = electronRequire('request');
const APP_ENV = electronRequire('electron').remote.getGlobal('APP_ENV');
const API_HOST = process.env.API_HOST || 'http://localhost:3000';

// TODO: do request in background
export const request = createStubbableFunction(function request(params) {
  return new Promise(function(resolve, reject) {
    const requestOptions = Object.assign({}, params, {
      baseUrl: API_HOST,
      method: params.method || 'GET',
      body: params.body ? JSON.stringify(params.body) : undefined,
      headers: Object.assign({}, params.headers, {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Basic ${APP_ENV.API_TOKEN}`,
        'X-0-Hub': '1'
      })
    });

    nodeRequest(requestOptions, (error, response, payload) => {
      if (process.env.NODE_ENV === 'development') {
        console.debug('PH Request: %s', `[${requestOptions.method}] ${requestOptions.url}`, error, response);
      }

      if (error) {
        reject(error);
      }
      else if (response.statusCode >= 400) {
        reject(reduceResponse(response));
      }
      else {
        resolve(reduceResponse(response).responseJSON);
      }
    });
  });
});

function reduceResponse(response) {
  return {
    meta: response.toJSON(),
    statusCode: response.statusCode,
    responseText: response.body,
    responseJSON: /application\/json/.test(response.headers['content-type']) ?
      JSON.parse(response.body) :
      null
    ,
    responseHeaders: response.headers,
    toString() {
      return response.body;
    }
  }
}