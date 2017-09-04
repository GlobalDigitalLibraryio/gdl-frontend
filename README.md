# GDL front-end
[![Build Status](https://travis-ci.org/GlobalDigitalLibraryio/gdl-frontend.svg?branch=master)](https://travis-ci.org/GlobalDigitalLibraryio/gdl-frontend)

This is the front-end for http://digitallibrary.io/

### Technologies

This application is built with [Next.js](https://github.com/zeit/next.js/) and [React](https://facebook.github.io/react/). It uses [Flow](https://flow.org/en/) for static type checking.

### Start development server

Start node server with hot reloading middleware listening on port 3000.

```
$ yarn run dev
```

### Translations
For i18n we use [lingui](https://github.com/lingui/js-lingui).

#### Updating translations

Whenever new that are to be translated using lingui are added, run the following command to update the existing translation files:
```
$ yarn run i18n:extract
```
at minimum you should update the English translation file.

#### Adding new translations
To add a new translation, for instance, for Norwegian bokmål, run the following command:
```
$ yarn run i18n:add-locale -- nb
```
and send the newly created `messages.json` file to a translator for translation.
