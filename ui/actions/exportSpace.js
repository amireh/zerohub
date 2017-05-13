const FORMAT_JSON = 'JSON';
const FORMAT_ZIP  = 'ZIP';
const applyOntoNull = require('./applyOntoNull');
const fetchSpace = require('./fetchSpace');
const retrievePassPhrase = require('./retrievePassPhrase');
const decryptPageContents = require('./decryptPageContents');
const generatePasswordKey = require('utils/generatePasswordKey');
const async = require('async');

module.exports = function exportSpace({
  format = 'json',
  spaceId,
  userId,
  tickFn,
}) {
  fetchSpaceAndPassPhrase({ userId, spaceId })
    .then(({ space, pages, passPhrase }) => {
      return decryptPages({ pages, passPhrase }).then(decryptedPages => {
        return { space, pages, decryptedPages, passPhrase }
      })
    })
    .then(({ space, decryptedPages }) => {
      const currentDate = (new Date()).toISOString().split('T')[0];

      download({
        data: JSON.stringify(decryptedPages, null, 4),
        fileName: `${currentDate}-${space.pretty_title}.json`,
        mimeType: 'application/json'
      })
    })
  ;
}

function fetchSpaceAndPassPhrase({ userId, spaceId }) {
  return Promise.all([
    applyOntoNull(fetchSpace, {
      userId,
      spaceId
    }),

    applyOntoNull(retrievePassPhrase, {
      key: generatePasswordKey({ userId, spaceId }),
    })
  ]).then(([ { space, pages }, { passPhrase } ]) => {
    return {
      space,
      pages,
      passPhrase: passPhrase && passPhrase.value || null
    }
  });
}

function decryptPages({ pages, passPhrase }) {
  console.debug('decrypting %d pages', pages.length)
  return new Promise(function(resolve, reject) {
    async.mapLimit(pages, 3, function(page, done) {
      if (!page.encrypted) {
        return done(null, page);
      }

      decryptPageContents(null, { page, passPhrase })
        .then(attributes => {
          done(null, Object.assign({}, page, attributes))
        })
        .catch(error => {
          done(error);
        })
      ;
    }, function(err, decryptedPages) {
      if (err) {
        reject(err);
      }
      else {
        resolve(decryptedPages);
      }
    })
  });
}

function download({ data, fileName, mimeType }) {
  const file = new Blob([data], { type: mimeType });
  const anchorNode = document.createElement("a");
  const url = URL.createObjectURL(file);

  anchorNode.href = url;
  anchorNode.download = fileName;

  document.body.appendChild(anchorNode);

  anchorNode.click();

  document.body.removeChild(anchorNode);

  window.URL.revokeObjectURL(url);
}

module.exports.FORMAT_JSON = FORMAT_JSON;
module.exports.FORMAT_ZIP = FORMAT_ZIP;