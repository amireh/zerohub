import queryString from 'query-string';

export default function ajax({ url, method, body, headers: userHeaders }) {
  let service;

  const headers = new Headers();
  const options = { method };

  headers.append('Content-Type', 'application/json');
  headers.append('Accept', 'application/json');

  Object.keys(userHeaders || {}).forEach(key => {
    headers.append(key, userHeaders[key]);
  });

  if (options.method === 'GET' || !options.method) {
    service = fetch(`${url}?${queryString.stringify(body)}`, {
      headers,
      credentials: 'include',
    });
  }
  else {
    service = fetch(url, { method, headers, body: JSON.stringify(body) });
  }

  return service.then(response => {
    if (response.ok && response.status === 204) {
      return null;
    }
    else if (response.ok) {
      return response.json();
    }
    else {
      return response.json().then(error => {
        throw error;
      });
    }
  });
}