FROM node:10.13.0-alpine

ARG MODULE
RUN test -n "$MODULE"

ENV HOME=/home/app
ENV APP_PATH=$HOME/$MODULE

RUN yarn global add bolt

# Copy necessary files for installing dependencies
COPY yarn.lock package.json $APP_PATH/

WORKDIR $APP_PATH
RUN yarn install --frozen-lockfile --no-cache --production

# Since we use a monorepo, copy every package over, so Bolt can symlink them for us
COPY packages $APP_PATH/packages

# Run bolt before src copy to enable better layer caching
WORKDIR $APP_PATH
RUN bolt

# Build and start the correct frontend
WORKDIR $APP_PATH/packages/$MODULE
RUN yarn build

CMD ["yarn", "run", "start"]
