module.exports = {
  apps: [
    {
      name: 'life-destiny-k-line',
      script: 'npm',
      args: 'run dev',
      env: {
        NODE_ENV: 'development',
        PORT: 3003
      },
      watch: false,
      autorestart: true,
      max_memory_restart: '1G'
    },
    {
      name: 'life-destiny-k-line-prod',
      script: 'npm',
      args: 'run preview',
      env: {
        NODE_ENV: 'production',
        PORT: 3003
      },
      watch: false,
      autorestart: true,
      max_memory_restart: '500M'
    }
  ]
};
