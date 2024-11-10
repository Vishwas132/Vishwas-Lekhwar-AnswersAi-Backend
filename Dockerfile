FROM node:18-alpine

# Set working directory
WORKDIR /usr/src/app

# Install dependencies first (for better caching)
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Create .env file from example if it doesn't exist
COPY .env.example .env

# Expose port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
