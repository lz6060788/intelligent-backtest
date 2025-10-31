export default {
  info: { url: '/user/info', method: 'GET' },
  login: { url: '/user/login', method: 'POST' },
  update: { url: '/user/update', method: 'PUT' },
  delete: { url: '/user/delete', method: 'DELETE' },
} as const;
