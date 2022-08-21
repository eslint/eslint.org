---
layout: post
title: How a parser translates text into tokens and then into an abstract syntax tree
teaser: "You will learn how the source code in any proramming language is converted to token and then parsed to generate an AST. The AST can then be traversed to write and build custom rules in ESLint."
image: 
authors:
  - Gayathri Krishnaswamy
categories:
  - Blog post
tags:
  - Lexical analysis
  - Syntax analysis
  - Abstract Syntax Tree
  - AST
  - Tokens
  - ESLint rules
---
##  Introduction
[ESLint](https://eslint.org/docs/latest/) is an open-source pluggable JavaScript linter that uses the Abstract Syntax Tree (AST) of your source code to identify and report patterns found in ECMAScript/JavaScript code. The tool also provides an option to write and configure your own rules to enforce a particular coding style that is relevant only to your project.

In this article, first, we'll see on a high-level how your source code is converted into multiple tokens and is then parsed to produce an AST that represents the syntactic structure of your source code. Next, we'll understand how ESLint leverages the capability of AST and helps you build your own custom rules.

Before we jump into details, let's understand a couple of key terminologies:

- Compiler - A [compiler](https://en.wikipedia.org/wiki/Compiler) is a special program that converts the programming language’s source code into machine-readable code that targets specific operating systems and computer architectures. 

- Parser - A [parser](https://en.wikipedia.org/wiki/Parsing) is a program that is part of the compiler that generates a very abstract representation of your source code, often a tree or a graph.

Now, let's look into the main steps involved in how compilers process the source code:

Step 1: Lexical analysis

Step 2: Syntax analysis

Step 3: Code generation


## Step 1: Lexical analysis
[Lexical analysis](https://en.wikipedia.org/wiki/Lexical_analysis) commonly known as tokenization is the process of converting your source code into a sequence of tokens. A token can be any valid entity in a programming language such as an identifier, keyword, operator, function call, string, or separator. Tokens do not understand how things fit together instead focus on different components of a file. Consider it analogous to breaking a sentence into different words and identifying the words such as nouns, verbs, numbers, adjectives, and punctuation. At this point, you don’t understand what’s part of a sentence or how these words fit together to make a sentence. The below picture depicts how a simple `if statement` is converted into multiple tokens.

![If statement converted to tokens](/src/assets/images/blog/2022/lexical-analysis.png "source code to tokens")

## Step 2: Syntax analysis
In this step, the list of tokens is converted into an AST - tree-like data structure that represents the actual structure of the code.

![AST](/src/assets/images/blog/2022/AST-visual.png "AST")
The AST visual shown above is generated using [JointJS](https://resources.jointjs.com/demos/javascript-ast).

 You can consider this step analogous to finding the relationship between nouns, verbs, and adjectives in a sentence and identifying how they conform to the language’s grammar.  Continuing with the same example, in the previous step, we had a pair of tokens for ( ) but now after syntax analysis, we can infer that it is an expression within an `if block`.

![A list of tokens converted to AST](/src/assets/images/blog/2022/syntax-analysis.png "tokens to AST")

In the above example,[ AST explorer](https://astexplorer.net/#/gist/052d25ec2db5e45442e474ffc8dd0f43/latest) is used for visualizing the AST for a simple JavaScript code snippet. AST explorer is a freely available online tool that can be used to generate AST for different programming languages.

:information_source:**Tip**: If you ever get lost in the AST, you can hover over different sections of your source code on the right and the tool then highlights the relevant node in the AST on the left.

The AST represents the relationship between the tokens generated from the source code as a tree comprising different nodes. Every node has at least a type specifying what it is representing. For example, a node type could be a `Literal` representing an actual value or a `CallExpression` that represents a function call. The `Literal` node might only contain a value whereas the `CallExpression` node can contain additional information such as what is being called (`callee`), or what `arguments` are being passed in.

:memo: It is important to remember that the format of AST changes depending on the type of programming language and the type of tool used for parsing. 

###  Linting using AST
You can traverse the different nodes of the AST to gain insights or perform actions. One of the most common use cases that extensively use AST traversal is
[ linting](https://en.wikipedia.org/wiki/Lint_(software)). ESLint uses [Espree](https://github.com/eslint/espree)  parser to create an AST from JavaScript code and the AST is defined by the  common standard [ESTree](https://github.com/estree/estree) specification. To understand the different types of nodes represented in the AST refer to [ES5 AST grammar documentation](https://github.com/estree/estree/blob/master/es5.md). You can refer to ESLint[ documentation](https://eslint.org/docs/latest/user-guide/configuring/rules#disabling-rules) to learn more about their built-in rules and how you can build custom rules, plugins, and formatters.

Here's an[ example in the AST explorer](https://astexplorer.net/#/gist/052d25ec2db5e45442e474ffc8dd0f43/f2146de2d27649296a810fc4e88293b649782649) that establishes a rule that you cannot have an empty catch block. We then traverse the AST and write a rule in ESLint to check if there are empty catch blocks in the source code.
```
"use strict";
module.exports = {
  meta: {
    type: 'problem', // `problem`, `suggestion`, or `layout`
    docs: {
      description: "This rule catches an empty catch block",
       },
    fixable: null, // Or `code` or `whitespace`
    schema: [], // Add a schema if the rule has options
    messages: {
      emptyCatch: 'Empty catch block is not allowed.',
  },
  },
  create(context) {
    return {
      CatchClause(node)
        {
          if (node.body.body.length === 0) {
            context.report({node: node.body, messageId: 'emptyCatch'});
          }
        }
    };
  },
};

```

In the above code snippet, we check if the length of the body of the `CatchClause` node is 0. If yes,  ESLint’s [report](https://eslint.org/docs/latest/developer-guide/working-with-rules#contextreport) method is used to raise a complaint.

## Step 3: Code generation
Need inputs from engineers.

##  What’s next?

Now that you have gained a high-level understanding of how your source code is converted to tokens and parsed to generate an AST, go ahead and generate the AST for your source code and build your own custom rules, parsers, and formatters using ESLint. If you have any questions, reach out to us at xyz@eslint.com.

You can also refer to our extensive [documentation](https://eslint.org/docs/latest/) on our brand-new website.
