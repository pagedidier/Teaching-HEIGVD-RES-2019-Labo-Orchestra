FROM node:latest
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY src /usr/src/app
RUN npm install
ENTRYPOINT ["node", "app.js"]