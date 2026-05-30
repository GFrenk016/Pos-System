module.exports = {
  apps: [
    {
      name: 'swiftpos',
      script: 'index.js',
      watch: false,
      env: {
        NODE_ENV: 'production',
        PORT: 3001,
      },
    },
  ],
}
