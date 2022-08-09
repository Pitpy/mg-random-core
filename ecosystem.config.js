module.exports = {
  apps: [
    {
      name: "bcel-random-app:3111",
      script: "./main.js",
      watch: false,
      env: {
        PORT: 3111,
        NODE_ENV: "development",
      },
      env_production: {
        PORT: 3111,
        NODE_ENV: "production",
      },
    },
  ],
};
