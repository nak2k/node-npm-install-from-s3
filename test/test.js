const test = require('tape');
const { installFromS3 } = require('..');

test('test', t => {
  t.plan(1);
  if (process.env.S3_URL) {
    installFromS3([process.env.S3_URL], {}, err => {
      if (err) {
        return t.end(err);
      }

      t.ok(true);
    });
  } else {
    // would be better to have a permanent S3 URL for testing...
    t.ok(true);
  }
});
