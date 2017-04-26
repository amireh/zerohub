const PageEncryptionService = require('services/PageEncryptionService');

module.exports = async function setPageEncryptionStatus(container, { passPhrase, page, encrypted }) {
  if (encrypted === page.encrypted) {
    return Promise.resolve();
  }

  container.setState({ saving: true });

  try {
    if (encrypted) {
      const encryptedPage = await PageEncryptionService.encryptPage({ passPhrase, page });

      container.setState({
        saving: false,
        page: Object.assign({}, page, {
          digest: encryptedPage.digest,
          encrypted: true,
        })
      });
    }
    // decrypting
    else {
      const decryptedPage = await PageEncryptionService.decryptPage({ passPhrase, page });

      container.setState({
        saving: false,
        page: Object.assign({}, page, {
          digest: null,
          encrypted: false,
          content: decryptedPage.content,
        })
      });
    }
  }
  catch (e) {
    container.setState({
      saving: false,
      saveError: true
    })

    throw e;
  }
}
