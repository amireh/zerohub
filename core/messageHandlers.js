const keytar = require('keytar');
const crypto = require('crypto');
const { ipcMain } = require('electron');
const discardNullValues = require('./discardNullValues');

let rendererMessageId = 0;

const Handlers = {
  GENERATE_MESSAGE_ID(event) {
    event.returnValue = String(++rendererMessageId);
  },

  RETRIEVE_PASS_PHRASE(event, message) {
    const descriptor = keytar.getPassword('0hub', message.data.key);

    event.sender.send('RETRIEVE_PASS_PHRASE_RC', {
      id: message.id,
      data: {
        passPhrase: descriptor ? {
          key: message.data.key,
          value: descriptor
        } : null
      }
    });
  },

  // TODO: reject if password exists
  GENERATE_PASS_PHRASE(event, message) {
    const phrase = crypto.randomBytes(64).toString('hex');

    keytar.replacePassword('0hub', message.data.key, phrase);

    event.sender.send('RETRIEVE_PASS_PHRASE_RC', {
      id: message.id,
      data: {
        passPhrase: {
          key: message.data.key,
          value: phrase
        }
      }
    });
  },

  ENCRYPT_TEXT(event, message) {
    const { passPhrase, plainText } = message.data;
    const cipher = crypto.createCipher('aes192', passPhrase);
    const encrypted = cipher.update(plainText, 'utf8', 'hex') + cipher.final('hex');

    event.sender.send('ENCRYPT_TEXT_RC', {
      id: message.id,
      data: encrypted
    });
  },

  DECRYPT_TEXT(event, message) {
    const { passPhrase, encryptedText } = message.data;
    const cipher = crypto.createDecipher('aes192', passPhrase);

    let plainText;
    let error;

    try {
      plainText = cipher.update(encryptedText, 'hex', 'utf8') + cipher.final('utf8');
    }
    catch (e) {
      error = e.message;
    }

    event.sender.send('DECRYPT_TEXT_RC', {
      id: message.id,
      error,
      data: plainText
    });
  },

  CALCULATE_DIGEST(event, message) {
    const { text } = message.data;
    const hmac = crypto.createHash('sha256');

    hmac.update(text);

    const digest = hmac.digest('hex');

    event.sender.send('CALCULATE_DIGEST_RC', {
      id: message.id,
      data: digest
    });
  },

  CALCULATE_SECRET_DIGEST(event, message) {
    const { passPhrase, text } = message.data;
    const hmac = crypto.createHmac('sha256', passPhrase);

    hmac.update(text);

    const digest = hmac.digest('hex');

    event.sender.send('CALCULATE_SECRET_DIGEST_RC', {
      id: message.id,
      data: digest
    });
  },

  UPDATE_SETTINGS(event, message) {
    const settings = getUserSettings();
    const nextSettings = discardNullValues({
      apiToken: message.data.apiToken
    });

    keytar.replacePassword('0hub', 'settings', JSON.stringify(
      Object.assign({}, settings, nextSettings)
    ));

    event.sender.send('UPDATE_SETTINGS_RC', {
      id: message.id,
      data: {
        success: true
      }
    });
  },

  RETRIEVE_SETTINGS(event, message) {
    const settings = getUserSettings();

    event.sender.send('RETRIEVE_SETTINGS_RC', {
      id: message.id,
      data: settings
    });
  }
};

Object.keys(Handlers).forEach(messageName => {
  ipcMain.on(messageName, Handlers[messageName]);
});

function getUserSettings() {
  const rawData = keytar.getPassword('0hub', 'settings');

  try {
    return JSON.parse(rawData) || {};
  }
  catch (e) {
    return {};
  }
}
