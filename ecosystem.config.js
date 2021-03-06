module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
  apps : [

    // First application
    {
      name      : "wxpachong-API",
      script    : "app.js",
      instances : 4,
      exec_mode : "cluster",
      env: {
        COMMON_VARIABLE: "true"
      },
      env_production : {
        NODE_ENV: "production"
      }
    },
  ],

  /**
   * Deployment section
   * http://pm2.keymetrics.io/docs/usage/deployment/
   */
  deploy : {
    production : {
      user : "root",
      host : "27.122.58.206",
      ref  : "origin/master",
      repo : "git@github.com:cky917/wxPachong.git",
      path : "/home/cky/www/production/wxPachong",
      "post-deploy" : "npm install && npm run build && pm2 startOrRestart ecosystem.config.js --env production && npm run get"
    },
    dev : {
      user : "root",
      host : "27.122.58.206",
      ref  : "origin/dev",
      repo : "git@github.com:cky917/wxPachong.git",
      path : "/home/cky/www/development/wxPachong",
      "post-deploy" : "npm install && pm2 startOrRestart ecosystem.config.js --env dev",
      env  : {
        NODE_ENV: "dev"
      }
    }
  }
}
