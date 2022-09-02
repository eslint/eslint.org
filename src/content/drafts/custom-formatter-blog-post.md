---
layout: post
title: Creating a Custom Formatter 
teaser: | 
  Learn how to customize the output format of ESLint results by creating your own custom formatter.
authors:
  - bpmutter
categories:
  - Tutorials
tags:
  - Guest Post
  - Custom Formatter
---

In this post, you'll look at how to create a [custom formatter](https://eslint.org/docs/latest/developer-guide/working-with-custom-formatter)
for your ESLint project. Custom formatters are JavaScript functions
that let you create a unique output for your linting results. 

You might want to make a custom formatter if the formatters built into ESLint 
don't meet the needs of your use case. You can learn more about ESLint's built-in
formatters in the [formatter documentation](https://eslint.org/docs/latest/user-guide/formatters/).
Some reasons to create a custom formatter include: 

* You only want to report specific error types.
* You want to format to the results in a way not supported by a built-in formatter.
* You want to perform an async operation on the results, like sending them to a
  server for further analysis.

By the end of this post, you'll know how to: 

* Create an ESLint custom formatter
* Publish it to npm
* Use it in your project

## What you will build

In the remainder of this post, your're going to create a custom formatter that
outputs ESLint results to [TOML](https://toml.io/).
TOML is a format for representing data, similar to JSON or YAML.
Developers often use TOML for config files, as it's optimized for human readability.

The custom formatter you'll build will take an array of ESLint formatter
`results` objects like this: 

```js
[
    {
        filePath: "/path/to/a/file.js",
        messages: [
            {
                ruleId: "curly",
                severity: 2,
                message: "Expected { after 'if' condition.",
                line: 2,
                column: 1,
                nodeType: "IfStatement"
            },
            {
                ruleId: "no-process-exit",
                severity: 2,
                message: "Don't use process.exit(); throw an error instead.",
                line: 3,
                column: 1,
                nodeType: "CallExpression"
            }
        ],
        errorCount: 2,
        warningCount: 0,
        fixableErrorCount: 0,
        fixableWarningCount: 0,
        source:
            "var err = doStuff();\nif (err) console.log('failed tests: ' + err);\nprocess.exit(1);\n"
    },
    {
        filePath: "/path/to/Gruntfile.js",
        messages: [],
        errorCount: 0,
        warningCount: 0,
        fixableErrorCount: 0,
        fixableWarningCount: 0
    }
]
```

Then, the custom formatter will create the TOML output: 

```toml
errorCount = 2
filePath = "/path/to/a/file.js"
fixableErrorCount = 0
fixableWarningCount = 0
[[0.messages]]
column = 1
line = 2
message = "Expected { after 'if' condition."
nodeType = "IfStatement"
ruleId = "curly"
severity = 2
[[0.messages]]
column = 1
line = 3
message = "Don't use process.exit(); throw an error instead."
nodeType = "CallExpression"
ruleId = "no-process-exit"
severity = 2
source = "var err = doStuff();\nif (err) console.log('failed tests: ' + err);\nprocess.exit(1);\n"
warningCount = 0
[1]
errorCount = 0
filePath = "/path/to/Gruntfile.js"
fixableErrorCount = 0
fixableWarningCount = 0
messages = []
warningCount = 0
```

You'll also see how to publish the formatter to npm and use it in a project.

## Steps

Before you begin:

1. Have [Node.js](https://nodejs.org) and npm installed in your development environment.
2. Have a basic understanding of how to use Node.js and npm.
3. If you want to publish your custom formatter to npm like you'll cover below, 
   [create an npm account](https://www.npmjs.com/signup) and login from the
   [npm CLI](https://docs.npmjs.com/cli/v7/commands/npm-adduser).

### 1. Create project

First, you're going to create the project for your custom formatter.
Since an ESLint custom formatter is just a JavaScript function, let's create a 
new project for the custom formatter by running the following:

```bash
mkdir eslint-formatter-toml
cd eslint-formatter-toml
npm init -y
```

Add ESLint to the project:

```bash
npm init -y @eslint/config
```

Select the following options when prompted:

| Prompt | Answer |
|:-------|:-------|
| How would you like to use ESLint? | To check syntax and find problems |
| What type of modules does your project use? | CommonJS (require/exports) | 
| Which framework does your project use? | None of these |
| Does your project use TypeScript? | No |
| Where does your code run? | Node |
| What format do you want your config file to be in? | JavaScript |

This creates the file `.eslintrc.js` with your ESLint configuration.
The file should look like:

```js
module.exports = {
    "env": {
        "browser": true,
        "commonjs": true,
        "es2021": true,
        "jest": true
    },
    "extends": "eslint:recommended",
    "overrides": [
    ],
    "parserOptions": {
        "ecmaVersion": "latest"
    },
    "rules": {
    }
}
```

For more information on customizing your ESLint configuration,
refer to the [Configuration File documentation](https://eslint.org/docs/latest/user-guide/configuring/configuration-files).

Next, add the [json2toml](https://www.npmjs.com/package/json2toml) package, which you'll use to help convert JavaScript objects to TOML: 

```bash
npm install json2toml
```

Now you're ready to write the custom formatter.

### 2. Create the custom formatter 

Custom formatters are just JavaScript functions that receive a `results` object and 
optional `context` object as arguments and return a string as an output.
In the custom formatter you'll make in this post, you'll just use the `results` argument.
The `results` argument contains array of all the ESLint results.
For more information, refer to the [results object documentation](https://eslint.org/docs/latest/developer-guide/working-with-custom-formatters#the-result-object).

In the `eslint-formatter-toml` directory, create a new file `formatter.js`.
Now let's create the custom formatter in `formatter.js`:

```js
// Import package to convert JS objects to TOML
const json2tomlConverter = require('json2toml');

/**
 * Custom formatter function that takes ESLint results and converts to TOML.
 * @param {result[]} results See ESLint docs for more info on result object: 
 *    https://eslint.org/docs/latest/developer-guide/working-with-custom-formatters#the-result-object 
 * @returns {string} string representation of TOML results
 */
function formatTOML(results){
  return json2tomlConverter(results);
}

// Exported custom formatter function
module.exports = formatTOML;

```

### 3. Test the custom formatter

With the custom formatter made, let's test it out locally. 

First, you need the file that you're going to lint. 
Add the directory `test-data` containing the file  `fullOfProblems.js`,
which has some ESLint errors that you'll run the test on.
Add the following contents to `test-data/fullOfProblems.js`:

```js
function addOne(i) {
    if (i != NaN) {
        return i ++
    } else {
      return
    }
};
```

Next, let's test your custom formatter out manually with the `eslint` CLI. 
Include the path to your formatter as the argument to the `--format` flag.

Run the following:

```bash
npx eslint test-data/fullOfProblems.js --format ./formatter.js
```

You should see a TOML version of the ESLint report in your terminal. 

Now that the custom formatter is working, let's test it programmatically with a 
unit test.
Install the JavaScript testing package [Jest](https://jestjs.io/)
and the [toml](https://www.npmjs.com/package/toml) package,
which you'll use to test the custom formatter:

```bash
npm install jest toml --save-dev
```

In your `package.json` file, update your test script to use Jest:

```json
  // ...other config
  "scripts": {
    "test": "jest"
  },
  // ...other config
```

Now create a file for the test, `formatter.test.js`. In the test file,
you're going to use the [ESLint Node.js API](https://eslint.org/docs/latest/developer-guide/nodejs-api).
Add the following code to `formatter.test.js`:

```js
const { ESLint } = require('eslint');
const toml = require('toml');

test("Test TOML formatter", async () => {
  const eslint = new ESLint();
  const results = await eslint.lintFiles(['test-data/fullOfProblems.js']);

  const tomlFormatter = await eslint.loadFormatter('./formatter.js')
  const tomlResults = tomlFormatter.format(results);
  const tomlBackToJs = toml.parse(tomlResults);

  // Check parsing back to JS
  expect(tomlBackToJs.errorCount).toBe(3);

  // Uncomment the following line to see the results
  // console.log(tomlResults);
});
```

With everything ready, let's run the test:

```bash
npm test
```

In the terminal you should see the following output with the passing test results:

```
> eslint-formatter-toml@1.0.0 test
> jest

 PASS  ./formatter.test.js
  ✓ Test TOML formatter (180 ms)

Test Suites: 1 passed, 1 total
Tests:       1 passed, 1 total
Snapshots:   0 total
Time:        1.04 s, estimated 2 s
Ran all test suites.
```

Everything is working as expected!

### 4. Publish to npm

Since you've validated that the custom formatter works the way you expect from the tests,
you are ready to publish it to npm. Once it's published, anyone on the internet
who wants to use the custom formatter is able to.

Update the project's `package.json` file with the following information:

| **Field**     | **Value**  |
|:--------------|:------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `"name"`        | A unique string name for the package. The package name **must** begin with `eslint-formatter-`. There cannot be any other packages published on npm with the same name. |
| `"version"`     | A string version for the package, like `"1.0.0"`. |
| `"description"` | A string description of the package.|
| `"main"`        | `"formatter.js"` |
| `"keywords"`    | `["eslint-formatter", "eslintformatter", "eslint"]`. Add any other keywords you'd like to the array. |
| `"author"`      | String or object with any author information you'd like to add. For more information, refer to the [npm documention](https://docs.npmjs.com/cli/v8/configuring-npm/package-json#people-fields-author-contributors). |

Your `package.json` should look similar to the following: 

```json
{
  "name": "eslint-formatter-toml",
  "version": "1.0.0",
  "description": "ESLint custom formatter that publishes the formatter output in TOML",
  "main": "formatter.js",
  "keywords": ["eslint-formatter", "eslintformatter", "eslint"],
  "author": {
    "name" : "Ben Perlmutter",
    "email" : "ben@example.com",
    "url" : "http://ben.perlmutter.io/"
  },
  "license": "MIT",
  "dependencies": {
    "json2toml": "^3.0.1"
  },
  "devDependencies": {
    "eslint": "^8.23.0",
    "jest": "^29.0.1",
    "toml": "^3.0.0"
  }
}
```

The package is ready for publication. To publish it, run the following command
from the main directory of the project:

```bash
npm publish
```

Now the formatter is live for anyone to use! You can find it by visiting the link
`https://www.npmjs.com/package/eslint-formatter-<REST-OF-YOUR-PACKAGE-NAME>`.

### 5. Use published custom formatter

Use the published package by installing the custom formatter in your project
with the following command: 

```bash
npm install --save-dev eslint-formatter-toml
```

Then add a script for running the package with ESLint to your `package.json`. 
Include your formatter's name as the argument to the `--format` flag.
You can omit `eslint-formatter-` from the argument,
just including `<YOUR-PACKAGE-NAME>`.
ESLint knows to look for packages starting with `eslint-formatter-`.

```json
{
  // ...other configuration
  "scripts": {
    //...other scripts
    "test:prod": "eslint --format toml test-data/fullOfProblems.js"
  },
  // ...other configuration
}
```

To test the script, run:

```bash
npm run test:prod
```

You should see the same TOML output in the terminal. 

## Wrapping it up

That's it! You now know how to create a ESLint custom formatter, publish it,
and use it in a project. 

If you'd like to view the source code for the example in this post, check out
[the repository on Github](https://github.com/bpmutter/eslint-formatter-toml).