FROM node:8.11.2-alpine

ARG MODULE
RUN test -n "$MODULE"

ENV HOME=/home/app
ENV APP_PATH=$HOME/$MODULE

RUN yarn global add bolt

# Copy necessary files for installing dependencies
COPY yarn.lock package.json $APP_PATH/
COPY packages/$MODULE/package.json $APP_PATH/packages/$MODULE/

# Run bolt before src copy to enable better layer caching
WORKDIR $APP_PATH
RUN bolt

# Copy necessary source files for server and client build
COPY .babelrc packages/$MODULE $APP_PATH/
COPY packages/$MODULE $APP_PATH/packages/$MODULE/

# Build client code
WORKDIR $APP_PATH
RUN bolt run build

CMD ["yarn", "run", "start"]
