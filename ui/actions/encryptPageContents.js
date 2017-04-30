const { calculateDigest, encrypt } = require('services/CoreDelegate');

module.exports = async function encryptPageContents({ passPhrase, page }) {
  const encryptedText = await encrypt({
    passPhrase,
    plainText: page.content
  });

  return {
    content: encryptedText,
    digest: await calculateDigest({ text: page.content })
  };
}
