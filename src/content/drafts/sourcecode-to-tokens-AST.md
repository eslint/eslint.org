---
layout: post
title: How a parser translates text into tokens and then into an abstract syntax tree
teaser: "You will learn how the source code in any proramming language is converted to multiple tokens and is then parsed to generate an Abstract Syntax Tree. You can then then traverse the AST to write and build custom rules in ESLint."
image: 

authors:
  - gayathri-krishnaswamy
categories:
  - Tutorials
tags:
  - Lexical analysis
  - Syntax analysis
  - Abstract Syntax Tree
  - AST
  - Tokens
  - ESLint rules
---
##  Introduction
A parser is a program that takes input in the form of sequential source program instructions and breaks it into smaller pieces (tokens) to generate statements and expressions. The parser then represents the statements and expressions in the form of a parse tree or an Abstract Syntax Tree (AST) that depicts the syntactic structure of your source code.

:information_source: Not all parsers create an AST. An AST is required only to inspect the overall structure of the program. Parsers written for other purposes, such as immediate conversion into another format, may not create an AST at all.

In this tutorial, first, you'll learn on a high-level how your source code is broken down into multiple tokens and is then converted to an AST. Next, you'll learn how [ESLint](https://eslint.org/docs/latest/) leverages the capability of AST and helps you build your own custom rules. This tutorial is intended for those who use ESLint and wants to understand more about how the tool works. It assumes that you have basic familiarity with:
- Computer programming
- Javascript coding
- ESLint tool
  
By the end of this tutorial, you’ll be able to:
- Understand how the source code is converted to AST.
- Generate AST for your source program using AST explorer.
- Understand how to traverse the AST nodes to write custom rules in ESLint.

## Step 1: Lexical analysis
[Lexical analysis](https://en.wikipedia.org/wiki/Lexical_analysis) commonly known as tokenization is the process of converting your source code into a sequence of tokens. A token can be any valid entity in a programming language such as an identifier, keyword, operator, function call, string, or separator. Tokens do not understand how things fit together instead focus on different components of a file. Consider it analogous to breaking a sentence into different words and identifying the words such as nouns, verbs, numbers, adjectives, and punctuation. At this point, you don’t understand what’s part of a sentence or how these words fit together to make a sentence. The below picture depicts how a simple `if statement` is converted into multiple tokens.

![If statement converted to tokens](/src/assets/images/blog/2022/lexical-analysis.png "source code to tokens")

## Step 2: Syntax analysis
In this step, the list of tokens is converted into an AST - tree-like data structure that represents the actual structure of the code.

![AST](/src/assets/images/blog/2022/AST-visual.png "AST")
The AST visual shown above is generated using [JointJS](https://resources.jointjs.com/demos/javascript-ast).

 You can consider this step analogous to finding the relationship between nouns, verbs, and adjectives in a sentence and identifying how they conform to the language’s grammar.  Continuing with the same example, in the previous step, there were three individual tokens for x, >, and 18 but after syntax analysis, it can be inferred that x>18 is a condition for an `if statement`. 

![A list of tokens converted to AST](/src/assets/images/blog/2022/syntax-analysis.png "tokens to AST")

In the above example,[ AST explorer](https://astexplorer.net/#/gist/052d25ec2db5e45442e474ffc8dd0f43/latest) is used for visualizing the AST for a simple JavaScript code snippet. AST explorer is a freely available online tool that can be used to generate AST for different programming languages.

:information_source:**Tip**: If you ever get lost in the AST, you can hover over different sections of your source code on the right and the tool then highlights the relevant node in the AST on the left.

The AST represents the relationship between the tokens generated from the source code as a tree comprising different nodes. Every node has at least a type specifying what it is representing. For example, a node type could be a `Literal` representing an actual value or a `CallExpression` that represents a function call. The `Literal` node might only contain a value whereas the `CallExpression` node can contain additional information such as what is being called (`callee`), or what `arguments` are being passed in.

:memo: It is important to remember that the format of AST changes depending on the type of programming language and the type of tool used for parsing. 

###  Linting using AST
You can traverse the different nodes of the AST to gain insights or perform actions. One of the most common use cases that extensively use AST traversal is _linting_ - the process of checking the source code for programmatic and stylistic errors. ESLint uses [Espree](https://github.com/eslint/espree)  parser to create an AST from JavaScript code and the AST is defined by the common standard [ESTree](https://github.com/estree/estree) specification. To understand the different types of nodes represented in the AST refer to [ES5 AST grammar documentation](https://github.com/estree/estree/blob/master/es5.md). You can refer to ESLint[ documentation](https://eslint.org/docs/latest/user-guide/configuring/rules#disabling-rules) to learn more about their built-in rules and how you can build custom rules, plugins, and formatters.

Here's an[ example in the AST explorer](https://astexplorer.net/#/gist/052d25ec2db5e45442e474ffc8dd0f43/f2146de2d27649296a810fc4e88293b649782649) that establishes a rule that you cannot have an empty catch block. You can then traverse the AST and write a rule in ESLint to check if there are empty catch blocks in the source code.
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

In the above code snippet, check if the length of the body of the `CatchClause` node is 0. If yes, use ESLint’s [report](https://eslint.org/docs/latest/developer-guide/working-with-rules#contextreport) method to raise a complaint.

##  What's next?
- [Generate AST for your source code](https://astexplorer.net/).
- [Learn how to write and configure your own custom ESLint rules](https://developers.mews.com/how-to-write-custom-eslint-rules/). 

If you have any questions, reach out to us at xyz@eslint.com.

You can also refer to our extensive [documentation](https://eslint.org/docs/latest/) on our brand-new website.