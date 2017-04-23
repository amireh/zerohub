import pick from 'utils/pick';
import createStubbableFunction from 'utils/createStubbableFunction';
import fetch from 'isomorphic-fetch';

// const fetch = electronRequire('isomorphic-fetch');

const REQUEST_ATTRIBUTES = [
  'method',
  'body',
  'headers',
  'credentials',
];

export default createStubbableFunction(function ajax(params) {
  return fetch(params.url, pick(params, REQUEST_ATTRIBUTES))
    .then(checkStatus, raiseConnectionError)
    .then(parseJSON)
  ;
});

function checkStatus(response) {
  if (response.ok) {
    return response;
  }
  else {
    const error = new Error(response.statusText);
    error.response = response;
    throw error;
  }
}

function raiseConnectionError(errorMessage) {
  throw new Error(errorMessage);
}

function parseJSON(response) {
  return response.text().then(text => {
    if (/application\/json/.test(response.headers.get('Content-Type'))) {
      try {
        return JSON.parse(text);
      }
      catch (e) {
        return text;
      }
    }
    else {
      return text;
    }
  });
}
