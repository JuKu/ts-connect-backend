FROM node:16

# Update npm
RUN npm install -g npm@latest

# see also: https://nodejs.org/en/docs/guides/nodejs-docker-webapp/

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .

RUN chmod -R 777 /usr/src/app/logs

VOLUME ["/usr/src/app/config"]
VOLUME ["/usr/src/app/logs"]

EXPOSE 8080

CMD [ "npm", "run", "start-prod" ]

