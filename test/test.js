const test = require('tape');
const installFromS3 = require('..');

test('test', t => {
  t.plan(1);

  installFromS3([process.env.S3_URL], {}, err => {
    if (err) {
      return t.end(err);
    }

    t.ok(true);
  });
});
