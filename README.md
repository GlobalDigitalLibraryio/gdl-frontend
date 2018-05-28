# GDL front-end

[![Build Status](https://travis-ci.org/GlobalDigitalLibraryio/gdl-frontend.svg?branch=master)](https://travis-ci.org/GlobalDigitalLibraryio/gdl-frontend)

This is the front-end for http://digitallibrary.io/

# Installation

#### Before you start

* [node](https://nodejs.org/) version should be 8 or above (to check `node -v`) or use [nvm](https://github.com/creationix/nvm).
* [yarn](https://yarnpkg.com/) should be installed globally.

#### Install

Each module lives in it's own package under the `packages` directory. We are using [bolt](https://github.com/boltpkg/bolt) to manage our monorepo, so you are going to need bolt installed globally as well.

```
yarn global add bolt
```

Next, to install packages, we use bolt, just calling it:

```
bolt
```
