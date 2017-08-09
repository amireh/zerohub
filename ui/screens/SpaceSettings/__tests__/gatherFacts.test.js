const { assert } = require('test_utils');
const subject = require('../gatherFacts')
const { encryptPageContents } = require('actions')
describe('SpaceSettings::gatherFacts', function() {
  const password = 'asdfasdf'

  describe('@hasPassPhrase', function() {
    it('is true if a pass-phrase was retrieved for this user/space', function() {
      return subject({
        space: {},
        user: {},
        pages: [],
        password
      }).then(facts => {
        assert.ok(facts.hasPassPhrase)
      })
    })
  })

  describe('@hasUsablePassPhrase', function() {
    it('is false if there is no passphrase', function() {
      return subject({
        space: {},
        user: {},
        pages: [],
        password: null
      }).then(facts => {
        assert.notOk(facts.hasUsablePassPhrase)
      })
    })

    it('is false if there are pages encrypted with a different passphrase', function() {
      return subject({
        space: {},
        user: {},
        pages: [{
          encrypted: true,
          content: 'asdf'
        }],
        password
      }).then(facts => {
        assert.notOk(facts.hasUsablePassPhrase)
      })
    })

    it('is true if there are pages encrypted with the same passphrase', function() {
      const page = {
        encrypted: true,
        content: 'hello world!'
      }

      return encryptPageContents({
        passPhrase: password,
        page
      }).then(({ content, digest }) => {
        return subject({
          space: {},
          user: {},
          pages: [Object.assign({}, page, {
            content,
            digest
          })],
          password
        }).then(facts => {
          assert.ok(facts.hasUsablePassPhrase)
        })
      })
    })

    it('is true if there are no encrypted pages', function() {
      return subject({
        space: {},
        user: {},
        pages: [{ encrypted: false }],
        password
      }).then(facts => {
        assert.ok(facts.hasUsablePassPhrase)
      })
    })
  })
})