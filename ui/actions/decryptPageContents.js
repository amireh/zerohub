const { calculateDigest, send } = require('services/CoreDelegate');

function decryptPageContents(_, { passPhrase, page }) {
  return send('DECRYPT_TEXT', { encryptedText: page.content, passPhrase, }).then(plainText => {
    return calculateDigest({ text: plainText }).then(digest => {
      return { content: plainText, digest, };
    })
  })
}

module.exports = decryptPageContents;