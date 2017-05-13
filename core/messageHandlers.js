const keytar = require('keytar');
const crypto = require('crypto');
const { ipcMain, dialog } = require('electron');
const discardUndefinedValues = require('./discardUndefinedValues');
const mainWindow = require('./mainWindow');

let rendererMessageId = 0;

const Handlers = {
  GENERATE_MESSAGE_ID(event) {
    event.returnValue = String(++rendererMessageId);
  },

  RETRIEVE_PASS_PHRASE(event, message) {
    const { key } = message.data;
    const descriptor = keytar.getPassword('0hub', key);

    event.sender.send('RETRIEVE_PASS_PHRASE_RC', {
      id: message.id,
      data: {
        passPhrase: descriptor ? {
          key: key,
          value: descriptor
        } : null
      }
    });
  },

  RETRIEVE_ALL_PASS_PHRASES(event, message) {
    const { userId, spaceIds } = message.data;
    const passPhrases = spaceIds.map(spaceId => {
      const key = `${userId}:${spaceId}`;

      return { key, value: keytar.getPassword('0hub', key) };
    }).filter(x => !!x.value);

    event.sender.send('RETRIEVE_ALL_PASS_PHRASES_RC', {
      id: message.id,
      data: {
        passPhrases
      }
    });
  },

  // TODO: reject if password exists
  GENERATE_PASS_PHRASE(event, message) {
    const phrase = crypto.randomBytes(32).toString('hex');
    const { userId, spaceId, save } = message.data;
    const key = `${userId}:${spaceId}`;

    if (save !== false) {
      keytar.replacePassword('0hub', key, phrase);
    }

    event.sender.send('GENERATE_PASS_PHRASE_RC', {
      id: message.id,
      data: {
        passPhrase: {
          key,
          value: phrase
        }
      }
    });
  },

  SAVE_PASS_PHRASE(event, message) {
    const { key, value } = message.data;

    keytar.replacePassword('0hub', key, value);

    event.sender.send('SAVE_PASS_PHRASE_RC', {
      id: message.id,
      data: {
        success: true
      }
    });
  },

  REMOVE_PASS_PHRASE(event, message) {
    const { key } = message.data;

    keytar.deletePassword('0hub', key);

    event.sender.send('REMOVE_PASS_PHRASE_RC', {
      id: message.id,
      data: {
        success: true
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
    const plainText = cipher.update(encryptedText, 'hex', 'utf8') + cipher.final('utf8');

    event.sender.send('DECRYPT_TEXT_RC', {
      id: message.id,
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
    const nextSettings = discardUndefinedValues({
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
  },

  OPEN_MODAL(event, message) {
    const win = mainWindow.getWindow();

    dialog.showMessageBox(win, message.data, (response, checkboxChecked) => {
      event.sender.send('OPEN_MODAL_RC', {
        id: message.id,
        data: {
          response,
          checkboxChecked
        }
      })
    })
  }
};

Object.keys(Handlers).forEach(messageName => {
  ipcMain.on(messageName, function(event, message) {
    try {
      Handlers[messageName](event, message);
    }
    catch (e) {
      event.sender.send(`${messageName}_RC`, {
        id: message.id,
        error: e && e.message || true,
      });
    }
  });
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
