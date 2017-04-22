const { ipcMain } = require('electron')
const keytar = require('keytar');
const crypto = require('crypto');

let rendererMessageId = 0;

ipcMain.on('GENERATE_MESSAGE_ID', (event) => {
  event.returnValue = String(++rendererMessageId);
});

ipcMain.on('RETRIEVE_PASS_PHRASE', (event, message) => {
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
})

// TODO: reject if password exists
ipcMain.on('GENERATE_PASS_PHRASE', (event, message) => {
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
})

ipcMain.on('ENCRYPT_TEXT', (event, message) => {
  const { passPhrase, plainText } = message.data;
  const cipher = crypto.createCipher('aes192', passPhrase);
  const encrypted = cipher.update(plainText, 'utf8', 'hex') + cipher.final('hex');

  event.sender.send('ENCRYPT_TEXT_RC', {
    id: message.id,
    data: encrypted
  });
})


ipcMain.on('DECRYPT_TEXT', (event, message) => {
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
})

ipcMain.on('CALCULATE_DIGEST', (event, message) => {
  const { passPhrase, plainText } = message.data;
  const hmac = crypto.createHmac('sha256', passPhrase);

  hmac.update(plainText);

  const digest = hmac.digest('hex');

  event.sender.send('CALCULATE_DIGEST_RC', {
    id: message.id,
    data: digest
  });
})
