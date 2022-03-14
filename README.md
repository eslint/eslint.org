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

## Translations

If you'd like to add a new translation of this website, please [open an issue](https://github.com/eslint/new.eslint.org/issues/new/choose) first.

In order to create a new translation:

1. Copy the `src/_data/sites/en.yml` file to a new site file in the same directory. The filename should be the language code of the language you want to translate into. For example, if you want to translate into Spanish, you should create the file `src/_data/sites/es.yml` because "es" in the Spanish language code.
2. Translate the text in the new site file to your chosen language.
3. Test it locally to ensure that it works properly using the instructions in the previous section.
4. Submit your pull request

The ESLint team will create a new domain name, set up analytics and ads, and otherwise prepare the website for deployment.

## License

Apache 2.0
