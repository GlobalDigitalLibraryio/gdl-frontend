FROM node:8.11.2-alpine

ARG MODULE
RUN test -n "$MODULE"

ENV HOME=/home/app
ENV APP_PATH=$HOME/$MODULE

RUN yarn global add bolt

# Copy necessary files for installing dependencies
COPY yarn.lock package.json $APP_PATH/

# Since we use a monorepo, copy every package over, so Bolt can symlink them for us
COPY packages $APP_PATH/packages

# Run bolt before src copy to enable better layer caching
WORKDIR $APP_PATH
RUN bolt

# Copy necessary source files for server and client build
COPY .babelrc $APP_PATH/

# Build client code
WORKDIR $APP_PATH
RUN bolt run build

# Make sure we start the correct frontend
WORKDIR $APP_PATH/packages/$MODULE

CMD ["yarn", "run", "start"]
