const { ipcRenderer } = electronRequire('electron')

function generateMessageId() {
  return ipcRenderer.sendSync('GENERATE_MESSAGE_ID');
}

function send(messageType, params) {
  const REQUEST_CHANNEL = messageType;
  const RESPONSE_CHANNEL = `${messageType}_RC`;

  return new Promise((resolve, reject) => {
    const messageId = generateMessageId();

    const listener = (event, message) => {
      if (message.id === messageId) {
        ipcRenderer.removeListener(RESPONSE_CHANNEL, listener);
      }

      if (process.env.NODE_ENV === 'development') {
        console.debug('response received from core!', RESPONSE_CHANNEL, message)
      }

      if (message.error) {
        reject(message.error);
      }
      else {
        resolve(message.data);
      }
    };

    if (process.env.NODE_ENV === 'development') {
      console.debug('request sent to core:', REQUEST_CHANNEL, params)
    }

    ipcRenderer.on(RESPONSE_CHANNEL, listener);
    ipcRenderer.send(REQUEST_CHANNEL, {
      id: messageId,
      data: params
    })
  });
}

export function retrievePassPhrase({ spaceId }) {
  const REQUEST_CHANNEL = 'RETRIEVE_PASS_PHRASE';
  const RESPONSE_CHANNEL = 'RETRIEVE_PASS_PHRASE_RC';

  return new Promise((resolve, reject) => {
    const messageId = generateMessageId();

    const listener = (event, message) => {
      if (message.id === messageId) {
        ipcRenderer.removeListener(RESPONSE_CHANNEL, listener);
      }

      console.log('response received from core!', RESPONSE_CHANNEL, message)

      if (message.error) {
        reject(message.error);
      }
      else {
        resolve(message.data.passPhrase);
      }
    };

    ipcRenderer.on(RESPONSE_CHANNEL, listener);
    ipcRenderer.send(REQUEST_CHANNEL, {
      id: messageId,
      data: {
        key: spaceId
      }
    })
  });
}

export function generatePassPhrase({ spaceId }) {
  const REQUEST_CHANNEL = 'GENERATE_PASS_PHRASE';
  const RESPONSE_CHANNEL = 'GENERATE_PASS_PHRASE_RC';

  return new Promise((resolve, reject) => {
    const messageId = generateMessageId();

    const listener = (event, message) => {
      if (message.id === messageId) {
        ipcRenderer.removeListener(RESPONSE_CHANNEL, listener);
      }

      console.debug('response received from core!', RESPONSE_CHANNEL, message)

      if (message.error) {
        reject(message.error);
      }
      else {
        resolve(message.data.passPhrase);
      }
    };

    ipcRenderer.on(RESPONSE_CHANNEL, listener);
    ipcRenderer.send(REQUEST_CHANNEL, {
      id: messageId,
      data: {
        key: spaceId
      }
    })
  });
}

export function encrypt({ passPhrase, plainText }) {
  return Promise.all([
    send('ENCRYPT_TEXT', {
      plainText,
      passPhrase
    }),

    send('CALCULATE_DIGEST', {
      plainText,
      passPhrase
    })
  ]).then(results => {
    return {
      value: results[0],
      digest: results[1]
    }
  });
}

export function decrypt({ passPhrase, encryptedText }) {
  return send('DECRYPT_TEXT', {
    encryptedText,
    passPhrase
  });
}

export function digest({ passPhrase, plainText }) {
  return send('CALCULATE_DIGEST', {
    plainText,
    passPhrase
  });
}