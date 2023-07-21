# Base image
FROM node:alpine

# Set the working directory
WORKDIR /smarthome

# Copy package.json and package-lock.json
COPY package*.json ./

# Install app dependencies
RUN npm ci

# Copy the rest of the application code
COPY . .

RUN npx prisma generate

# Build TypeScript code
RUN npm run build

# Expose port
EXPOSE 3000 5432 5433

# Start the application
CMD ["npm", "start"]
