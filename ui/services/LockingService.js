const { request } = require('services/PageHub');

exports.acquireLock = async function({ lockableType, lockableId }) {
  return request({
    url: `/api/v2/locks`,
    method: 'POST',
    body: {
      resource_type: lockableType,
      resource_id: lockableId,
    }
  });
}

exports.releaseLock = async function({ lockableType, lockableId }) {
  return request({
    url: `/api/v2/locks`,
    method: 'DELETE',
    body: {
      resource_type: lockableType,
      resource_id: lockableId,
    }
  });
}