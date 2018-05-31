FROM node:8.11.2-alpine

ENV HOME=/home/app
ENV APP_PATH=$HOME/gdl-frontend

RUN yarn global add bolt

# Copy necessary files for installing dependencies
COPY yarn.lock package.json $APP_PATH/
COPY packages/gdl-frontend/package.json $APP_PATH/packages/gdl-frontend/

# Run bolt before src copy to enable better layer caching
WORKDIR $APP_PATH
RUN bolt

# Copy necessary source files for server and client build
COPY .babelrc packages/gdl-frontend $APP_PATH/
COPY packages/gdl-frontend $APP_PATH/packages/gdl-frontend/

# Build client code
WORKDIR $APP_PATH
RUN bolt run build

CMD ["yarn", "run", "start"]
