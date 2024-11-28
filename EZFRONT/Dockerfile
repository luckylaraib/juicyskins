# Base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy the entire project
COPY . .

# Build the application
RUN yarn build

# Expose the Next.js port
EXPOSE 3000

# Start the application
CMD ["yarn", "start"]
