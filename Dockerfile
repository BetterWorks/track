FROM node:10

ENV APP=/home/app
WORKDIR $APP

RUN mkdir -p $APP/node_modules && chown -R node:node $APP
COPY package*.json $APP/
USER node
RUN npm config set depth=0 && npm install --production
COPY --chown=node:node . $APP

EXPOSE 8080

CMD ["npm", "run", "start"]
