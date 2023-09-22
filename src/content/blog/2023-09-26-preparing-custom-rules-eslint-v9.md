---
layout: post
title: "Preparing your custom rules for ESLint v9.0.0"
teaser: "The upcoming major release of ESLint includes several breaking changes for rule authors. Read on to learn how to update your rules for ESLint v9.0.0."
tags:
  - Rules
  - API
authors:
  - nzakas
categories:
  - API Changes
---

When ESLint v9.0.0 is released, it will ship with several breaking changes for rule authors. These changes are necessary as part of the work to implement [language plugins](https://github.com/eslint/rfcs/blob/main/designs/2022-languages/README.md), which gives ESLint first-class support for linting languages other than JavaScript. We've had to make these changes because ESLint has, from the start, assumed that it would only ever be used to lint JavaScript. As such, there wasn't a lot of thought put into where methods that rules used to interact with source code should live. When revisiting the API for the language plugins work we found that the inconsistencies we were able to live with in a JavaScript-only world will not work in a language-agnostic ESLint core.

## From `context` to `SourceCode`

The majority of the breaking changes for rule authors consist of moving methods off of the `context` object that is passed into rules and onto the `SourceCode` object that is retrieved via `context.sourceCode` (or the deprecated `context.getSourceCode()`; see below). The area of responsibility for `context` vs. `SourceCode` has shifted during the lifetime of ESLint: In the beginning, `context` was the home for everything rules needed to use. Once we added `SourceCode`, we slowly started adding more methods to it. The end result was that some methods lived on `context` and some methods lived on `SourceCode`, and the only reason why? The time at which the methods were added.

In a language-agnostic ESLint core, we need to redefine the responsibilities of these two objects. Going forward, `context` is the home for functionality that rules need to interact with the core while `SourceCode` is the home for functionality that rules need to interact with the code being linted. This allows the same `context` object to be used regardless of the language being linted as well as allowing language plugins to define their own `SourceCode` class to provide methods that are unique to that language.

All of this is to say that we are deprecating all of the code-related methods on `context` and moving them to `SourceCode`. The following table shows which fields on `context` are moving to `SourceCode`. Note that the method signatures remain unchanged for all of these methods even if the name changes:

|**Deprecated on `context`**|**Replacement(s) on `SourceCode`**|
|-----------------------|--------------------------|
|`context.getSource()`|`sourceCode.getText()`|
|`context.getSourceLines()`|`sourceCode.getLines()`|
|`context.getAllComments()`|`sourceCode.getAllComments()`|
|`context.getNodeByRangeIndex()`|`sourceCode.getNodeByRangeIndex()`|
|`context.getComments()`|`sourceCode.getCommentsBefore()`, `sourceCode.getCommentsAfter()`, `sourceCode.getCommentsInside()`|
|`context.getCommentsBefore()`|`sourceCode.getCommentsBefore()`|
|`context.getCommentsAfter()`|`sourceCode.getCommentsAfter()`|
|`context.getCommentsInside()`|`sourceCode.getCommentsInside()`|
|`context.getJSDocComment()`|`sourceCode.getJSDocComment()`|
|`context.getFirstToken()`|`sourceCode.getFirstToken()`|
|`context.getFirstTokens()`|`sourceCode.getFirstTokens()`|
|`context.getLastToken()`|`sourceCode.getLastToken()`|
|`context.getLastTokens()`|`sourceCode.getLastTokens()`|
|`context.getTokenAfter()`|`sourceCode.getTokenAfter()`|
|`context.getTokenBefore()`|`sourceCode.getTokenBefore()`|
|`context.getTokenByRangeStart()`|`sourceCode.getTokenByRangeStart()`|
|`context.getTokens()`|`sourceCode.getTokens()`|
|`context.getTokensAfter()`|`sourceCode.getTokensAfter()`|
|`context.getTokensBefore()`|`sourceCode.getTokensBefore()`|
|`context.getTokensBetween()`|`sourceCode.getTokensBetween()`|
|`context.parserServices`|`sourceCode.parserServices`|

All of the `context` methods listed in this table will be removed in ESLint v9.0.0, and the replacement methods on `SourceCode` have already been in place for six years, so you should have no problem switching to the new methods. (Yes, we deprecated these and then completely forgot to remove them.)

In addition to the methods in this table, there are several other methods that are also moving but required different method signatures.

### `context.getScope()`

The `context.getScope()` method is used to retrieve a scope object for the currently-traversed node. This method was always a bit strange because it uses ESLint's internal traversal state to determine which node to use as a reference point to retrieve a scope object. That meant it was both limited, because you couldn't change the reference node, and confusing, because it wasn't always clear what node was being referenced. So, we are deprecating this method and will remove it in ESLint v9.0.0.

We have introduced a new `SourceCode#getScope(node)` method that requires you to pass in the reference node. This method was added in ESLint v8.37.0 so it has already been in place for the last six months. For best compatibility, you can check for the presence of this new method to determine which one to use:

```js
module.exports = {
    create(context) {

        const { sourceCode } = context;

        return {
            Program(node) {
                const scope = sourceCode.getScope
                    ? sourceCode.getScope(node)
                    : context.getScope();

                // do something with scope
            }
        }
    }
};
```

### `context.getAncestors()`

The `context.getAncestors()` method is another method on `context` that used the internal traversal state to return the ancestors of the currently visited node. And also similar to `context.getScope()`, this meant the method was both limited and unclear. We are deprecating this method and will remove it in v9.0.0. The replacement method is `SourceCode#getAncestors(node)` (added in v8.38.0), which requires you to pass in the node whose ancestors you want to retrieve. Here is an example that checks for the correct method to use:

```js
module.exports = {
    create(context) {

        const { sourceCode } = context;

        return {
            Program(node) {
                const ancestors = sourceCode.getAncestors
                    ? sourceCode.getAncestors(node)
                    : context.getAncestors();

                // do something with ancestors
            }
        }
    }
};
```

### `context.getDeclaredVariables(node)`

The `context.getDeclaredVariables(node)` returns all variables declared by the given node (such as in a `let` statement). We are deprecating this method and will remove it in v9.0.0. We are replacing it with `SourceCode#getDeclaredVariables(node)` (added in v8.38.0), which works exactly the same way. Here is an example that checks for the correct method to use:

```js
module.exports = {
    create(context) {

        const { sourceCode } = context;

        return {
            Program(node) {
                const variables = sourceCode.getDeclaredVariables
                    ? sourceCode.getDeclaredVariables(node)
                    : context.getDeclaredVariables(node);

                // do something with variables
            }
        }
    }
};
```

### `context.markVariableAsUsed(name)`

The `context.markVariableAsUsed(name)` method finds a variable with the given name in the current scope and marks it as used so it won't cause a violation in the `no-unused-vars` rule. This method has quite a bit of magic going on behind the scenes, as it uses the currently visited node in the traversal to retrieve a scope and then searches that scope for a variable with the given name. We are deprecating this method and will remove it in v9.0.0. The replacement method is `SourceCode#markVariableAsUsed(name, node)` (added in v8.39.0) and requires you to pass in the reference node for the scope to search. (The scope ends up being the same as calling `SourceCode#getScope(node)`.) Here is an example that checks for the correct method to use:

```js
module.exports = {
    create(context) {

        const { sourceCode } = context;

        return {
            Program(node) {
                const result = sourceCode.markVariableAsUsed
                    ? sourceCode.markVariableAsUsed("foo", node)
                    : context.markVariableAsUsed("foo");

                if (result) {
                  // the variable was found and marked as used
                }
            }
        }
    }
};
```

## `CodePath#currentSegments`

A little-known ability of ESLint rules is [analyzing code paths](https://eslint.org/docs/latest/extend/code-path-analysis). ESLint core rules use code path analysis in multiple rules to validate not just what the code looks like but also how the logic flows. This is done through accessing `CodePath` and `CodePathSegment` objects. In doing our research for language plugins, we discovered that `CodePath#currentSegments` actually represents another traversal state that is exposed in rules. Specifically, `CodePath#currentSegments` is an array that grows and shrinks throughout traversal as you encounter different code path segments. Because code path analysis is unique to JavaScript, we can't have the core tracking this traversal state any longer. After evaluating several options, we decided that having an object that represented both code path data and traversal state was undesirable, so we are deprecating `CodePath#currentSegments` and will remove it in v9.0.0. We needed to add two new event handlers, `onUnreachableCodePathSegmentStart` and `onUnreachableCodePathSegmentEnd`, to allow access to the same data (these were added in v8.49.0).

To recreate this data, you'll need to track the traversal state manually, which can be accomplished with the following code:

```js
module.exports = {
    meta: {
        // ...
    },
    create(context) {

        // tracks the code path we are currently in
        let currentCodePath;

        // tracks the segments we've traversed in the current code path
        let currentSegments;

        // tracks all current segments for all open paths
        const allCurrentSegments = [];

        return {

            onCodePathStart(codePath) {
                currentCodePath = codePath;
                allCurrentSegments.push(currentSegments);
                currentSegments = new Set();
            },

            onCodePathEnd(codePath) {
                currentCodePath = codePath.upper;
                currentSegments = allCurrentSegments.pop();
            },

            onCodePathSegmentStart(segment) {
                currentSegments.add(segment);
            },

            onCodePathSegmentEnd(segment) {
                currentSegments.delete(segment);
            },

            onUnreachableCodePathSegmentStart(segment) {
                currentSegments.add(segment);
            },

            onUnreachableCodePathSegmentEnd(segment) {
                currentSegments.delete(segment);
            }
        };

    }
};
```

We have already made this change in all of the ESLint core rules to validate that the approach works as expected.

## `context` methods becoming properties

As we look towards the API we'd like rules for other languages to have, we decided to convert some methods on `context` to properties. The methods in the following table just returned some data that didn't change, so there was no reason they couldn't be properties instead.

|**Deprecated on `context`**|**Property on `context`**|
|-----------------------|--------------------------|
|`context.getSourceCode()`|`context.sourceCode`|
|`context.getFilename()`|`context.filename`|
|`context.getPhysicalFilename()`|`context.physicalFilename`|
|`context.getCwd()`|`context.cwd`|

We are deprecating the methods in favor of the properties (added in v8.40.0). These methods will be removed in v10.0.0 (not v9.0.0) as they are not blocking language plugins work. Here's an example that ensures the correct value is used:

```js
module.exports = {
    create(context) {

        const sourceCode = context.sourceCode ?? context.getSourceCode();
        const cwd = context.cwd ?? context.getCwd();
        const filename = context.filename ?? context.getFilename();
        const physicalFilename = context.physicalFilename ?? context.getPhysicalFilename();

        return {
            Program(node) {
                // do something
            }
        }
    }
};
```

## `context` properties: `parserOptions` and `parserPath` being removed

Additionally, the `context.parserOptions` and `context.parserPath` properties are deprecated and will be removed in v10.0.0 (not v9.0.0). There is a new `context.languageOptions` property that allows rules to access similar data as `context.parserOptions`. In general, though, rules should not depend on information either in `context.parserOptions` or `context.languageOptions` to determine how they should behave.

The `context.parserPath` property was intended to allow rules to retrieve an instance of the parser that ESLint is using via `require()`. However, the new flat config system does not know the location of the parser module to load, so we are unable to provide this data. Further, because the JavaScript ecosystem is moving to ESM, any value returned from this property will not work with `import()`. This property was added early on in ESLint's life and we generally recommend that rules not try to further parse JavaScript code inside of them. If necessary, you can use `context.languageOptions.parser` to access the parser ESLint is using.

## Conclusion

ESLint has been around for ten years, and in that time, we have collected some API cruft that we need to clean up in order to prepare ESLint for the next ten years. The API changes described in this post are a necessary step towards enabling ESLint to lint non-JavaScript languages and to better separate core functionality from language-specific functionality. The team spent a lot of time planning this transition point in ESLint's lifecycle and we hope that these changes are just a small inconvenience for the ecosystem. If you need help with, or have questions about, any of what was discussed in this post, please [start a discussion](https://github.com/eslint/eslint/discussions/new) or stop by [Discord](https://eslint.org/chat) to talk with the team.
