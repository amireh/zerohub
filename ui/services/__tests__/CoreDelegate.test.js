import { assert } from 'chai';
import * as CoreDelegate from '../CoreDelegate';

describe('Services::CoreDelegate', function() {
  describe('.digest', function() {
    const string = 'asdfjkl;';

    it('works', function(done) {
      CoreDelegate.digest({
        passPhrase: 'password',
        plainText: string
      }).then(function(digest) {
        assert.equal(digest, '65b67b52a5f5284d322cb14d559c6d67e3f2aa232c95dc181342397c5ae6fbb6');
        done();
      }).catch(done);
    })

    it('takes the passPhrase into account', function(done) {
      CoreDelegate.digest({
        passPhrase: 'another password',
        plainText: string
      }).then(function(digest) {
        assert.notEqual(digest, '65b67b52a5f5284d322cb14d559c6d67e3f2aa232c95dc181342397c5ae6fbb6');
        done();
      }).catch(done);
    })
  })
});