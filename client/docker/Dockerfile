FROM node:20.12.0-alpine3.19

# Set the working directory to the client app
WORKDIR /usr/src/app

# Copy the package files specific to the client app
COPY ./client/package.json ./client/package-lock.json ./client/tsconfig.json ./

# Install the dependencies for the client app
RUN npm install

# Copy the rest of the client app files
COPY ./client/ .

# Build the client app
RUN npm run build

# Start the client app
CMD ["npm", "run", "start"]
