# Description: Dockerfile for the frontend
# Using the node 18 image as the base image
FROM --platform=linux/amd64 node:18-alpine
# Create app directory
WORKDIR /app

# Copy package.json and package-lock.json
# COPY package.json package-lock.json ./

COPY yarn.lock ./

# Install serve globally to serve the static files
RUN npm i -g serve

# Install the dependencies
RUN yarn install

# Copy the rest of the files
COPY . ./

# Build the app
RUN yarn build

# Expose the port
EXPOSE 3010

# Serve the app
CMD ["yarn", "serve"]