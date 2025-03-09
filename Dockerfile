# Use official Node.js image
FROM node:20

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --force

# Copy project files
COPY . .

# Expose port
EXPOSE 4200

# Start Angular app
# CMD ["npm", "start"]
CMD ["npm", "start", "--", "--host", "0.0.0.0"]

