---
layout: page.html
permalink: /version-support/
multilingual: false
title: Version Support
description: >
    The ESLint team provides ongoing support for the current version and six
    months of limited support for the previous version.
hook: "version_support_page"
---

Major ESLint release lines move through a status of Current, to Maintenance, to End of Life (EOL). A release line is considered Current when prerelease work begins. At that point, the previous release line moves to Maintenance status and stays there until six months after the general availability of the Current release line. After that, the release line moves to EOL.

## Release Statuses

ESLint major release lines are designated by the level of support they receive from the ESLint team. The release statuses are:

* **Current** - Receives active maintenance and development from the ESLint team.
* **Maintenance** - Receives critical bug fixes, including security issues, and compatibility fixes to ensure interoperability between major release lines. There is no backporting of other fixes or features from the current release line.
* **End of Life (EOL)** - When a release line falls out of maintenance mode it receives no further updates from the ESLint team.

## Current Release Lines

| **Release Line** | **Status** | **First Release** | **Last Release** | **EOL Start** | **Commercial Support** |
|-------------------|------------|-------------------|-----------------|---------------|------------------------|
| v9.x             | Current    | 2024-04-05        | TBD              | TBD | [Tidelift][tidelift] |
| v8.0.0-v8.57.1   | EOL        | 2021-10-09        | 2024-09-16       | 2024-10-05 | [HeroDevs][herodevs] |
| v7.0.0-v7.32.0   | EOL        | 2020-05-08        | 2021-07-30       | 2022-04-09 | [HeroDevs][herodevs] |
| v6.0.0-v6.8.0    | EOL        | 2019-06-21        | 2019-12-20       | 2020-11-08 | [HeroDevs][herodevs] |
| v5.0.0-v5.16.0   | EOL        | 2018-06-22        | 2019-03-29       | 2019-12-21 | [HeroDevs][herodevs] |
| v4.0.0-v4.19.1   | EOL        | 2017-06-11        | 2018-03-21       | 2018-12-22 | [HeroDevs][herodevs] |
| v3.0.0-v3.19.0   | EOL        | 2016-07-01        | 2017-03-31       | 2017-12-11 | [HeroDevs][herodevs] |
| v2.0.0-v2.13.1   | EOL        | 2016-02-12        | 2016-06-20       | 2017-01-01 | [HeroDevs][herodevs] |
| v1.0.0-v1.10.3   | EOL        | 2015-07-31        | 2015-12-01       | 2016-08-12 | [HeroDevs][herodevs] |

## Commercial Support

ESLint offers commercial support through our partners, [Tidelift][tidelift] and [HeroDevs][herodevs].

For Current and Maintenance release lines, commercial support is provided by [Tidelift][tidelift]. Tidelift validates that ESLint is up-to-date with the latest security best practices and can be a first point of contact for any problems that may arise. [Learn more][tidelift]

For EOL release lines, commercial support is provided by [HeroDevs][herodevs]. HeroDevs provides drop-in replacements for older versions of ESLint that are kept up-to-date for security and compliance issues. [Learn more][herodevs]


[tidelift]: https://tidelift.com/funding/github/npm/eslint
[herodevs]: https://www.herodevs.com/support/eslint-nes?utm_source=ESLintWebsite&utm_medium=ESLintWebsite&utm_campaign=ESLintNES&utm_id=ESLintNES
