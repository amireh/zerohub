import { request } from 'services/PageHub';

export async function acquireLock({ lockableType, lockableId }) {
  return request({
    url: `/api/v2/locks`,
    method: 'POST',
    body: {
      resource_type: lockableType,
      resource_id: lockableId,
    }
  });
}

export async function releaseLock({ lockableType, lockableId }) {
  return request({
    url: `/api/v2/locks`,
    method: 'DELETE',
    body: {
      resource_type: lockableType,
      resource_id: lockableId,
    }
  });
}