module.exports = {
  apps : [{
    script: 'E:/Hebergements/Sites/MESI-BackEnd-dev/dist/app.js',
    //watch: 'true', 
    name: "back-develop"
  }],

  deploy : {
    production : {
      user : 'SSH_USERNAME',
      host : 'SSH_HOSTMACHINE',
      ref  : 'origin/master',
      repo : 'GIT_REPOSITORY',
      path : 'DESTINATION_PATH',
      'pre-deploy-local': '',
      'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env developpement',
      'pre-setup': ''
    }
  }
};
