FROM node:20.10-alpine

WORKDIR /delivery-app

ARG NODE_ENV=production
COPY ./package.json ./
COPY ./package-lock.json ./

RUN npm install

COPY ./src index.js src/
COPY ./index.js ./

CMD ["npm", "run", "start"]
