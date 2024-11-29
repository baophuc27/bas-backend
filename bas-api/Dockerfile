# Use an official Node.js runtime as a parent image
FROM --platform=linux/amd64 node:18-alpine

# Set the working directory to /app
WORKDIR /app

# Install dependencies for the canvas package
RUN apk add --no-cache python3 \
    make \
    g++ \
    cairo-dev \
    jpeg-dev \
    musl-dev \
    giflib-dev \
    font-liberation \
    pangomm-dev \
    libpng-dev \
    librsvg-dev \
    pango-dev \
    && rm -rf /var/cache/apk/* 

RUN apk add --no-cache bash

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Copy nodemon.json to the container
COPY nodemon.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the container
COPY . .

# Build the TypeScript code
RUN npm run build

#provide permission to the wait-for-it.sh file
RUN chmod +x /app/wait-for-it.sh


# Expose the port that the app will run on
EXPOSE 8008


# Start the app
#CMD [ "/bin/sh", "-c", "/app/wait-for-it.sh localhost:29092",  "--", "npm",  "run" , "start"]

CMD [ "npm", "start" ]