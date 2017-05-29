FROM node:6.6.0

#Add app user to enable running the container as an unprivileged user
RUN useradd --user-group --create-home --shell /bin/false app

ENV HOME=/home/app
ENV APP_PATH=$HOME/gdl-frontend

#Install yarn
RUN npm install --global yarn

# Copy necessary files for installing dependencies
COPY yarn.lock package.json $APP_PATH/
RUN chown -R app:app $HOME/*

# Run yarn before src copy to enable better layer caching
USER app
WORKDIR $APP_PATH
RUN yarn

# Copy necessary source files for server and client build
USER root
COPY components $APP_PATH/components
COPY pages $APP_PATH/pages
COPY static $APP_PATH/static
RUN chown -R app:app $HOME/*

# Build client code
USER app
WORKDIR $APP_PATH
RUN npm run build

CMD ["npm", "run", "start"]
