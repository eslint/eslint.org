# The New eslint.org

This repository contains the source code for the ESLint website (<https://eslint.org>). 

## Developer Setup

In order to run the website, you must have [Node.js](https://nodejs.org) installed.

1. Create a fork of the repository
2. Run `npm install`

To start a local copy of the website, run:

```shell
npm start
```

To start a local copy of a foreign language website, specify the `ESLINT_SITE_NAME` environment variable equal to the name of the site, such as:

```shell
ESLINT_SITE_NAME=es npm start
```

## License

Apache 2.0
