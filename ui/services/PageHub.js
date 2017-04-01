const nodeRequest = electronRequire('request');
const APP_ENV = electronRequire('electron').remote.getGlobal('APP_ENV');
const API_HOST = process.env.API_HOST || 'http://localhost:3000';

export function request(params) {
  return new Promise(function(resolve, reject) {
    nodeRequest(Object.assign({}, params, {
      url: `${API_HOST}${params.url}`,
      headers: Object.assign({}, params.headers, {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Basic ${APP_ENV.API_TOKEN}`
      })
    }), (error, response) => {
      if (error) {
        reject(error);
      }
      else if (response.statusCode >= 400) {
        reject(reduceResponse(response));
      }
      else {
        resolve(reduceResponse(response));
      }
    });
  });
}

function reduceResponse(response) {
  return {
    meta: response.toJSON(),
    statusCode: response.statusCode,
    responseText: response.body,
    responseJSON: /application\/json/.test(response.headers['content-type']) ? JSON.parse(response.body) : null,
    responseHeaders: response.headers,
    toString() {
      return response.body;
    }
  }
}