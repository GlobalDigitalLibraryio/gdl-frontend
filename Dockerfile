FROM node:8.11.1-alpine

ENV HOME=/home/app
ENV APP_PATH=$HOME/gdl-frontend

RUN yarn global add bolt
# Copy necessary files for installing dependencies
COPY yarn.lock package.json .babelrc packages/gdl-frontend $APP_PATH/

# Run yarn before src copy to enable better layer caching
WORKDIR $APP_PATH
RUN bolt

# Build client code
WORKDIR $APP_PATH
RUN yarn run build

CMD ["yarn", "run", "start"]
