---
layout: post
title: "New in ESLint v9.34.0: Multithread Linting"
teaser: "Make use of your CPU: multithreaded linting in ESLint v9.34.0 speeds up linting large projects."
tags:
  - Concurrency
  - Multithreading
  - Performance
draft: true
authors:
  - fasttime
categories:
  - Storytime
---

## Introduction

With ESLint v9.34.0, linting can now happen in true parallel. By spawning worker threads, ESLint can process multiple files at the same time, dramatically reducing lint times for large projects.  

On machines with multiple CPU cores and fast storage, this change can make a noticeable difference — especially when you're linting hundreds or thousands of files.

## CLI Multithreading Support

Multithreading is enabled through the new `--concurrency` flag. You can set it in a few different ways:

* **A positive integer** (e.g., `4`) tells ESLint the maximum number of threads to use. It will never spawn more threads than there are files to lint.  
* **`auto`** lets ESLint decide the optimal number of threads based on your CPU and file count.  
* **`off`** (the default) disables multithreading, equivalent to `--concurrency=1`.

The biggest gains come when linting many files on a multi-core machine with fast I/O. That said, if your configuration or plugins take a long time to initialize, using too many threads can actually slow things down. In CI runners, performance can be biased by limits of the host environment.

## Node.js API Support

If you're using the [Node.js API](https://eslint.org/docs/latest/integrate/nodejs-api), multithread linting is available via the new `concurrency` option in the `ESLint` constructor. The accepted values — numbers, `"auto"`, and `"off"` — work exactly as they do in the CLI.

### Cloneability Requirement

When concurrency is enabled, ESLint passes options to worker threads using the [structured clone algorithm](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm). This means only cloneable values — such as primitives, plain objects, and arrays — can be sent. Functions and custom class instances are not cloneable.

Some options, like `plugin`, `baseConfig`, and `overrideConfig`, can contain arbitrary values, while others, like `fix` and `ruleFilter`, can be functions. If you set an uncloneable value while concurrency is enabled, ESLint will throw an error:

> The option "ruleFilter" cannot be cloned. When concurrency is enabled, all options must be cloneable. Remove uncloneable options or use an options module.

### Using Options Modules

To work around cloneability limits, you can define your ESLint options in an ECMAScript module:

```js
// eslint-options.js
import config from "./my-eslint-config.js";

export default {
    concurrency: "auto",
    overrideConfig: config, // may include non-cloneable values
    overrideConfigFile: true,
    stats: true,
};
```

Then create an instance with [`ESLint.fromOptionsModule()`](https://eslint.org/docs/head/integrate/nodejs-api#-eslintfromoptionsmoduleoptionsurl):

```js
const optionsURL = new URL("./eslint-options.js", import.meta.url);
const eslint = await ESLint.fromOptionsModule(optionsURL);
```

In multithread mode, each worker imports the same module rather than receiving a cloned copy, so cloneability is no longer an issue.

You can even inline your options module using a data URL:

```js
const optionsModuleText = `
import config from "./my-eslint-config.js";

export default {
    concurrency: "auto",
    overrideConfig: config,
    overrideConfigFile: true,
    stats: true,
};
`;
const optionsURL = new URL(`data:text/javascript,${encodeURIComponent(optionsModuleText)}`);
const eslint = await ESLint.fromOptionsModule(optionsURL);
```

`ESLint.fromOptionsModule()` works with any URL type accessible to worker threads. While designed for multithread linting, options modules are a standalone feature you can use even without concurrency.

## How It Works

For years, ESLint has benefited from Node.js's event-loop architecture, which allows asynchronous tasks — like reading files from disk — to run in parallel. But CPU-intensive work, such as parsing files and applying rules, has always been synchronous, meaning only one file could be processed at a time.

In a typical run, file I/O is a small fraction of the total time; most of it is spent on parsing and rule execution. These tasks cannot be parallelized with a single thread. Multithread linting changes that. Each worker thread processes one file at a time, but multiple threads can work simultaneously. When all threads finish, their results are gathered in the main thread and returned together.

## History

The idea of parallelizing the linting process has been around for well over a decade, long before Node.js offered built-in worker threads. Early discussions wrestled with fundamental questions: which tools should be used for parallelization, how far should the scope extend, and what architectural changes would be required to make it possible. There were also concerns about the potential downsides — the extra maintenance burden, the risk of slowing down projects with only a handful of files if parallelization were enabled by default, and the possibility of blocking other desirable features such as project-based linting, which would require ESLint to understand relationships between multiple files even when linting them individually.

In the meantime, other tools forged ahead. Test runners like Ava, Mocha, and Jest began to ship with built-in parallel execution, and inventive developers found ways to run ESLint in parallel using wrappers and external scripts. These experiments proved that parallel linting could be valuable, but they also highlighted the limitations of bolting it on from the outside. Ultimately, the only way to make multithread linting truly seamless was to integrate it directly into ESLint's core.

## Challenges

Turning that long-standing idea into a practical, user-friendly feature was far from trivial. The first step was to gather the many threads of past conversations — most notably the proposals and debates in [issue #3565](https://github.com/eslint/eslint/issues/3565) — and weave them into a coherent design that could work equally well from the CLI and the Node.js API. The goal was to introduce multithreading with as little disruption as possible for existing consumers.

Technical hurdles soon followed. Chief among them was the requirement that all options passed to worker threads be cloneable, a restriction that ruled out certain common patterns such as passing functions or complex plugin objects directly. This limitation ultimately inspired the creation of options modules, which sidestep the cloneability problem entirely by letting each worker import the same module rather than receiving a cloned copy of the options.

Bringing multithread linting to life was a collaborative effort, shaped by the ideas, feedback, and testing of both the ESLint team and the wider community. We are thankful to everyone involved in the process of making this concept become a reality.

## Way Forward

We know that introducing multithread linting won't be without its hiccups. Some tools and configurations may not play nicely at first. As users adopt the feature, we expect to hear about issues, and we're committed to fixing them quickly.

## Further Tips

* Benchmark lint times before and after enabling concurrency to measure the impact.  
* Try different `--concurrency` values on each machine to find the ideal setting.  
* Combine `--cache` with multithreading for even faster incremental runs.
