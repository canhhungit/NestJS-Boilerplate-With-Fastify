module.exports = {
  apps: [
    {
      name: 'ws',
      script: 'dist/main.js',
      // autorestart: true,
      // watch: ['dist'],
      instances: 2,
      env: {
        NODE_ENV: 'development',
        PORT: 8888,
      },
    },
  ],
};
