
FROM node:latest

WORKDIR /abb

COPY ./package.json .

RUN yarn install --production

COPY ./dist ./dist
# COPY ./.env ./.env
COPY ./ormconfig.js ./ormconfig.js

ENV NODE_ENV production

# EXPOSE $PORT

CMD ["node", "dist/index.js"]