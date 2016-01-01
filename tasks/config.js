/*
 * Task 'default'
 */
exports.default = [];

/*
 * Task 's3upload'
 */
exports.s3upload = {
  packages: [__dirname + '/dummy'],
  dest: process.env.S3_URL,
};
