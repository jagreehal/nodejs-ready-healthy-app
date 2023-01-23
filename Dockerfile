FROM node:18-alpine

WORKDIR /usr

COPY package.json ./

RUN npm install --omit=dev

COPY ./dist/ ./dist/

ARG PORT=5001
EXPOSE ${PORT}

CMD [ "npm", "start" ]