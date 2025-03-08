# Stage 1: Build the Angular app
FROM node:20 as build
WORKDIR /proSPA

# Copy package files first to optimize Docker caching
COPY package.json package-lock.json ./
RUN npm install --force

# Copy the rest of the application source code
COPY . .

# Build the Angular app (output path: dist/pro-spa)
RUN npm run build --configuration=production
# RUN ng build --configuration=production

# Debugging: Check if the build directory exists inside the container
RUN ls -l /proSPA/dist || echo "Build directory missing"
RUN ls -l /proSPA/dist/pro-spa || echo "Build output missing"

# Stage 2: Serve the Angular app using Nginx
FROM nginx:alpine
WORKDIR /proSPA  # Maintain consistent working directory

# Copy built Angular app to Nginx's serving directory
# COPY --from=build /proSPA/dist/pro-spa /usr/share/nginx/html
COPY ./dist/pro-spa/browser /usr/share/nginx/html

# Expose port 80 for HTTP traffic
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
