const { calculateDigest, decrypt } = require('services/CoreDelegate');

async function decryptPageContents(_, { passPhrase, page }) {
  const plainText = await decrypt({
    passPhrase,
    encryptedText: page.content
  });

  return {
    content: plainText,
    digest: await calculateDigest({ text: plainText }),
  };
}

module.exports = decryptPageContents;