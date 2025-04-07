

# use the official nodejs v18 image with alpine linux as the base image
FROM node:18-alpine

WORKDIR /use/src/app

COPY package*.json ./

RUN npm ci --only=production

COPY . .

EXPOSE 4001

CMD [ "node", "src/server.js" ]