const FORMAT_JSON = 'JSON';
const FORMAT_ZIP  = 'ZIP';
const applyOntoNull = require('./applyOntoNull');
const fetchSpace = require('./fetchSpace');
const retrievePassPhrase = require('./retrievePassPhrase');
const decryptPageContents = require('./decryptPageContents');
const generatePasswordKey = require('utils/generatePasswordKey');
const async = require('async');
const JSZip = require('jszip');

module.exports = function exportSpace({
  format = 'json',
  spaceId,
  userId,
  tickFn,
}) {
  fetchSpaceAndPassPhrase({ userId, spaceId })
    .then(({ space, folders, pages, passPhrase }) => {
      return decryptPages({ pages, passPhrase }).then(decryptedPages => {
        return { space, folders, pages, decryptedPages, passPhrase }
      })
    })
    .then(({ space, folders, decryptedPages }) => {
      if (format === FORMAT_JSON) {
        serializeToJSON({ space, pages: decryptedPages })
      }
      else if (format === FORMAT_ZIP) {
        serializeToZIP({ space, folders, pages: decryptedPages })
      }
      else {
        throw new Error(`Unrecognized format ${format}`);
      }
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
  ]).then(([ { space, folders, pages }, { passPhrase } ]) => {
    return {
      space,
      folders,
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

function serializeToJSON({ space, pages }) {
  const currentDate = (new Date()).toISOString().split('T')[0];

  saveAs({
    data: JSON.stringify(pages, null, 4),
    fileName: `${currentDate}-${space.fqid || space.pretty_title}.json`,
    mimeType: 'application/json'
  })
}

function serializeToZIP({ space, pages, folders }) {
  const currentDate = (new Date()).toISOString().split('T')[0];
  const fileName = `${currentDate}-${space.fqid || space.pretty_title}.zip`;
  const zip = new JSZip();
  const getFolderPath = (folder, ancestry = []) => {
    if (!folder.folder_id) {
      return ancestry;
    }

    const [ parentFolder ] = folders.filter(x => x.id === folder.folder_id)

    if (parentFolder) {
      return getFolderPath(parentFolder, ancestry.concat(folder))
    }
    else {
      return ancestry.concat(folder);
    }
  }

  const getPagePath = page => {
    const [ folder ] = folders.filter(x => x.id === page.folder_id)
    const folderPath = getFolderPath(folder);

    return (
      [ space.fqid || space.pretty_title ]
        .concat(folderPath.map(x => x.pretty_title))
        .concat(page.pretty_title)
        .join('/')
    );
  }

  pages.forEach(function(page) {
    zip.file(getPagePath(page) + '.md', page.content);
  })

  zip.generateAsync({ type: 'blob' }).then(function(content) {
    console.debug(content)
    saveAs({ data: content, fileName, mimeType: 'application/octet-stream' });
  }).catch(error => {
    console.error('unable to generate zip!', error)
  });
}

function saveAs({ data, fileName, mimeType }) {
  const file = new Blob([data], { type: mimeType });
  const anchorNode = document.createElement("a");
  const url = URL.createObjectURL(file);

  anchorNode.href = url;
  anchorNode.download = getSafeFileName(fileName);

  document.body.appendChild(anchorNode);

  anchorNode.click();

  document.body.removeChild(anchorNode);

  window.URL.revokeObjectURL(url);
}

function getSafeFileName(fileName) {
  return fileName.replace(/\/+/g, '-').replace(/\-+/, '-')
}

module.exports.FORMAT_JSON = FORMAT_JSON;
module.exports.FORMAT_ZIP = FORMAT_ZIP;