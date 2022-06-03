# 14.18.2 (lts/fermium)
FROM node:14.18.2-alpine

WORKDIR /var/app

COPY . .

RUN yarn install

EXPOSE 8085

CMD [ "node", "index.js" ]