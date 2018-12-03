# GDL front-end

This is the public facing front-end for http://digitallibrary.io/

### Start development server

Start node server with hot reloading middleware listening on port 3000.

```
$ yarn run dev
```

### Types

Make sure you have [Apollo CLI](https://github.com/apollographql/apollo-tooling) installed.

```
$ yarn global add apollo
```

Then run

```
$ apollo client:codegen ./gqlTypes.js --outputFlat --includes "{pages,components,lib}/**/*.js" --target flow --endpoint http://localhost:4000/graphql
```

### Translations

For i18n we use [lingui](https://github.com/lingui/js-lingui).

#### Updating translations

Whenever new texts that are to be translated using lingui are added, run the following command to update the existing translation files:

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
