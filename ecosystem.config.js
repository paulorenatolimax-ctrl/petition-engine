module.exports = {
  apps: [{
    name: 'petition-engine',
    cwd: '/Users/paulo1844/Documents/OMNI/_IMIGRAÇÃO/Sistema Automatizado/petition-engine',
    script: 'node_modules/.bin/next',
    args: 'dev',
    watch: false,
    autorestart: true,
    max_restarts: 50,
    restart_delay: 2000,
    env: {
      NODE_ENV: 'development',
      PORT: 3000,
    },
  }],
};
