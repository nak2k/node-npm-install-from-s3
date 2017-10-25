const { createServer } = require('http');
const AWS = require('aws-sdk');
const parallel = require('run-parallel');
const { parse } = require('url');
const { installPackages } = require('./installPackages');

const debug = require('debug')('npm-install-from-s3');

module.exports = (s3Urls, options, callback) => {
  const s3 = new AWS.S3();

  parallel([
    callback => createProxy(s3, callback),
    callback => parallel(s3Urls.map(url => expandS3Url.bind(null, s3, url)), callback),
  ], (err, results) => {
    if (err) {
      return callback(err);
    }

    const proxy = results[0];
    const s3Urls = [].concat(...results[1]);

    const { address, port } = proxy.address();
    debug('listening on %s:%d', address, port);

    s3Urls.forEach(url => console.log('Installing', url));

    installPackages(s3Urls.map(url => {
      const { hostname, pathname } = parse(url);
      return `http://${address}:${port}/${hostname}${pathname}`;
    }), options, err => {
      debug('Stop proxy server');
      proxy.close();

      callback(err);
    });
  });
};

const expandS3Url = (s3, s3Url, callback) => {
  if (s3Url.endsWith('.tgz')) {
    return callback(null, [s3Url]);
  }

  const { hostname: Bucket, pathname } = parse(s3Url);
  const Prefix = pathname.substr(1);

  next(undefined, [], callback);

  function next(Marker, contents, callback) {
    const params = {
      Bucket,
      Prefix,
      Delimiter: undefined,
      EncodingType: 'url',
      Marker,
      MaxKeys: 1000,
    };

    s3.listObjects(params, (err, data) => {
      if (err) {
        return callback(err);
      }

      const { Contents, IsTruncated } = data;

      Contents
        .map(({ Key }) => `s3://${Bucket}/${Key}`)
        .filter(url => url.endsWith('.tgz'))
        .forEach(url => contents.push(url));

      if (IsTruncated) {
        const last = Contents[Contents.length - 1];
        next(last.Key, contents, callback);
      } else {
        callback(null, contents);
      }
    });
  };
};

const createProxy = (s3, callback) => {
  const server = createServer();

  server.on('error', callback);

  server.on('close', () => {
    debug('Proxy server is closed');
  });

  server.on('request', function(req, res) {
    const { url } = req;
    const index = url.indexOf('/', 1);

    const params = {
      Bucket: url.substring(1, index),
      Key: url.substr(index + 1),
    };

    s3.getObject(params)
      .createReadStream()
      .pipe(res);
  });

  server.listen(0, 'localhost', function() {
    callback(null, server);
  });
};
