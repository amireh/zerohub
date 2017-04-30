module.exports = function generatePasswordKey({ userId, spaceId }) {
  return `${userId}:${spaceId}`;
}