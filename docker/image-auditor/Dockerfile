FROM node:latest
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY src /usr/src/app
RUN npm install
EXPOSE 2205
ENTRYPOINT ["node", "app.js"]