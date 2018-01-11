FROM node:8.9.4-alpine

ENV HOME=/home/app
ENV APP_PATH=$HOME/gdl-frontend

# Copy necessary files for installing dependencies
COPY yarn.lock package.json $APP_PATH/

# Run yarn before src copy to enable better layer caching
WORKDIR $APP_PATH
RUN yarn

# Copy necessary source files for server and client build
COPY components $APP_PATH/components
COPY pages $APP_PATH/pages
COPY static $APP_PATH/static
COPY server $APP_PATH/server
COPY hocs $APP_PATH/hocs
COPY style $APP_PATH/style
COPY locale $APP_PATH/locale
COPY lib $APP_PATH/lib
COPY routes.js $APP_PATH
COPY .babelrc $APP_PATH
COPY config.js $APP_PATH
COPY fetch.js $APP_PATH

# Build client code
WORKDIR $APP_PATH
RUN yarn run build

CMD ["yarn", "run", "start"]
