module.exports = {
  apps : [{
    name: 'api-reservations',
    script: './server.js',
    watch: '.'
  }],

  deploy : {
    production : {
      user : 'muhammed_shereaf', 
      host : '165.22.16.244',
      ref  : 'origin/main',
      repo : 'git@github.com:Muhammed-Sherif/api-server.git',
      path : '/var/www/projects/reservations',
      'pre-deploy-local': '',
      'post-deploy' : 'npm install && pm2 reload ecosystem.config.cjs --env production',
      'pre-setup': ''
    }
  }
};
