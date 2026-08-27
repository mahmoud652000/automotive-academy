module.exports = {
  apps: [
    {
      name: 'automotive-api',
      script: 'server/server.js',
      cwd: __dirname,
      instances: 1,
      autorestart: true,
      max_restarts: 10,
      env: {
        NODE_ENV: 'production',
        PORT: 5000,
      },
    },
  ],
}
