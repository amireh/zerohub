import { assert } from 'chai';
import * as CoreDelegate from '../CoreDelegate';

describe('Services::CoreDelegate', function() {
  describe('.calculateSecretDigest', function() {
    const string = 'asdfjkl;';

    it('works', function(done) {
      CoreDelegate.calculateSecretDigest({
        passPhrase: 'password',
        text: string
      }).then(function(digest) {
        assert.equal(digest, '65b67b52a5f5284d322cb14d559c6d67e3f2aa232c95dc181342397c5ae6fbb6');
        done();
      }).catch(done);
    })

    it('takes the passPhrase into account', function(done) {
      CoreDelegate.calculateSecretDigest({
        passPhrase: 'another password',
        text: string
      }).then(function(digest) {
        assert.notEqual(digest, '65b67b52a5f5284d322cb14d559c6d67e3f2aa232c95dc181342397c5ae6fbb6');
        done();
      }).catch(done);
    })
  })

  describe('.calculateDigest', function() {
    const string = 'asdfjkl;';

    it('works', function(done) {
      CoreDelegate.calculateDigest({
        text: string
      }).then(function(digest) {
        assert.equal(digest, '33215f3e25d41bf49b959ca66eae2218f0e2b6c35beb50376381fa72a4ca6701');
        done();
      }).catch(done);
    })
  })

  describe('encryption', function() {
    const plainText = 'foobar';
    const encryptedText = 'ce6ec0e11195b8ff82b39f67c602d4a0';
    const passPhrase = 'speak friend and enter';

    it('encrypts some text', function(done) {
      CoreDelegate.encrypt({ passPhrase, plainText }).then(result => {
        assert.equal(result.value, encryptedText)
        assert.equal(result.digest, '8bc9ed91512683feff261d67ec353cdf74404a83ea2395c049c6d8109bb8eeb9')
        done();
      }).catch(done);
    })

    it('decrypts some text', function(done) {
      CoreDelegate.decrypt({
        encryptedText: encryptedText,
        passPhrase,
      }).then(result => {
        assert.equal(result.value, plainText)
        assert.equal(result.digest, 'c3ab8ff13720e8ad9047dd39466b3c8974e592c2fa383d4a3960714caef0c4f2')
        done();
      }).catch(done);
    })
  })
});