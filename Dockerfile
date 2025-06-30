# use node image
FROM node:24-alpine

# use app for workdir
WORKDIR /app

# install dependencies first
COPY package*.json ./

RUN npm install

# copy project, expose port, and start dev server
# TODO: This should not be used for a production server.
COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]