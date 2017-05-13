const { encryptPage, decryptPage } = require('services/PageEncryptionService');
const applyOntoNull = require('./applyOntoNull');
const async = require('async');

const CANCELED = new Error('Canceled');

module.exports = function bulkSetPageEncryptionStatus({
  passPhrase,
  pages,
  encrypted,
  tickFn = Function.prototype,
}) {
  let canceled = false;

  const cancel = () => { canceled = true };
  const promise = new Promise(function(resolve, reject) {
    const fn = encrypted ? encryptPage : decryptPage;
    let processedTally = 0;

    async.mapLimit(pages, 1, function(page, done) {
      applyOntoNull(fn, { passPhrase, page }).then(nextPage => {
        if (canceled) {
          return done(CANCELED);
        }

        processedTally += 1;

        tickFn({
          success: true,
          page: nextPage,
          progress: Math.round(processedTally / pages.length * 100),
        })

        done(null, nextPage);
      }).catch(error => {
        if (canceled) {
          return done(CANCELED);
        }

        processedTally += 1;

        tickFn({
          success: false,
          progress: Math.round(processedTally / pages.length * 100),
          page: page,
          error,
        })

        done(error);
      })
    }, function(err, nextPages) {
      if (err) {
        reject(err);
      }
      else {
        resolve(nextPages);
      }
    })
  });

  return { promise, cancel };
}

module.exports.CANCELED = CANCELED;