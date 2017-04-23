import invariant from 'invariant';
const { ipcRenderer } = electronRequire('electron')

export function retrievePassPhrase({ spaceId }) {
  invariant(typeof spaceId === 'string' && spaceId.length, '"spaceId" must be a string');

  return send('RETRIEVE_PASS_PHRASE', {
    key: spaceId
  }).then(payload => {
    return payload.passPhrase;
  });
}

export function generatePassPhrase({ spaceId }) {
  invariant(typeof spaceId === 'string' && spaceId.length, '"spaceId" must be a string');

  return send('GENERATE_PASS_PHRASE', {
    key: spaceId
  }).then(payload => {
    return payload.passPhrase;
  });
}

export function encrypt({ passPhrase, plainText }) {
  return send('ENCRYPT_TEXT', {
    plainText,
    passPhrase
  });
}

export function decrypt({ passPhrase, encryptedText }) {
  return send('DECRYPT_TEXT', {
    encryptedText,
    passPhrase
  });
}

export function calculateDigest({ text }) {
  invariant(typeof text === 'string' && text.length,
    '"text" must be a string'
  );

  return send('CALCULATE_DIGEST', { text });
}

export function calculateSecretDigest({ passPhrase, text }) {
  invariant(typeof passPhrase === 'string' && passPhrase.length,
    '"passPhrase" must be a string'
  );

  invariant(typeof text === 'string' && text.length,
    '"text" must be a string'
  );

  return send('CALCULATE_SECRET_DIGEST', { text, passPhrase });
}

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
