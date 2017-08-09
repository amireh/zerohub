const { decryptPageContents } = require('actions')
const async = require('async')

const isPageEncrypted = page => !!page.encrypted;
const canDecryptPage = ({ password }) => (page, callback) => {
  return decryptPageContents(null, {
    page,
    passPhrase: password
  }).then(() => callback(null, true), err => callback(err))
}

const hasUsablePassPhrase = (input, encryptedPages) => {
  return new Promise((resolve, reject) => {
    if (!input.password) {
      return reject();
    }

    async.everyLimit(encryptedPages, 4, canDecryptPage(input), function(err, ok) {
      if (err || !ok) {
        reject();
      }
      else {
        resolve();
      }
    })
  })
}

module.exports = (input) => {
  const { pages, password } = input;
  const encryptedPages = pages.filter(isPageEncrypted)
  const facts = {
    hasPassPhrase: !!password,
    hasUsablePassPhrase: null,
    encryptedPages,
  }

  return hasUsablePassPhrase(input, encryptedPages).then(() => {
    facts.hasUsablePassPhrase = true;
  }, () => {
    facts.hasUsablePassPhrase = false;
  }).then(() => facts)
}