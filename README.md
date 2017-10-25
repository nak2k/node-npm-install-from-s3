# npm-install-from-s3

Install packages from S3.

## Installation

```
npm install -g npm-install-from-s3
```

## Usage

If you specify an S3 URL that ends with `.tgz`, install only that tarball.

``` shell
npm-install-from-s3 s3://your-bucket/prefix/of/single-package.tgz

```

Otherwise, install all tarballs starting with the specified S3 URL and ending with `.tgz`.

``` shell
npm-install-from-s3 s3://your-bucket/prefix/of/packages
```

In the above case, such a following S3 Objects is installed.

- `s3://your-bucket/prefix/of/packages/foo.tgz`
- `s3://your-bucket/prefix/of/packages/bar/baz.tgz`

A tarball can be created by running [npm pack](https://docs.npmjs.com/cli/pack).

## Options

As with [npm install](https://docs.npmjs.com/cli/install) you can specify the following options:

- `--production`
- `-g`, `--global`

## License

MIT
