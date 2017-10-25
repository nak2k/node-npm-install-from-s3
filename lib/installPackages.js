const npm = require('npm');

exports.installPackages = (urls, options, callback) => {
  /*
   * Load npm data.
   */
  npm.load((err, npm) => {
    if (err) {
      return callback(err);
    }

    /*
     * Install packages.
     */
    npm.config.set('global', options.global);
    npm.config.set('save', false);

    npm.commands.install(urls, err => {
      if (err) {
        return callback(err);
      }

      callback(null);
    });
  });
};
