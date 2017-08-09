const generatePasswordKey = require('utils/generatePasswordKey');

module.exports = ({ user, space, secret }) => ({
  key: generatePasswordKey({
    userId: user.id,
    spaceId: space.id,
  }),

  value: secret
})