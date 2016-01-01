const parseArgs = require('minimist');
const installFromS3 = require('./installFromS3');

module.exports = function() {
  const cliOpts = parseArgs(process.argv.slice(2), {
    boolean: ['global'],
    alias: {
      global: 'g',
    },
  });

  if (cliOpts._.length < 1) {
    showUsage();
    return;
  }
  
  const s3Urls = cliOpts._;

  installFromS3(s3Urls, cliOpts, err => {
    if (err) {
      throw err;
    }
  });
};

function showUsage() {
  console.log('Usage: npm-install-from-s3 [options] <s3-url>');
}
