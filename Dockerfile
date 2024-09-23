# FROM node:20 
# WORKDIR /app
# COPY package*.json ./
# RUN npm install
# COPY . .
# RUN npm run build
# # CMD ["npm", "start"]
# CMD ["npm", "run", "dev"]
#
#
#

# Use Node.js 20 as the base image
FROM node:20

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your application files to the container
COPY . .

# Build the app (this is useful for production, but still fine for development)
RUN npm run build

# Expose the port your app runs on (adjust if needed)
EXPOSE 3000

# Use a development-specific command to run your app
CMD ["npm", "run", "dev"]

