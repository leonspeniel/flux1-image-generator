# Step 1: Use a Node.js base image
FROM node:16-alpine

# Step 2: Set the working directory inside the container
WORKDIR /app

# Step 3: Copy package.json and package-lock.json
COPY package*.json ./

# Step 4: Install dependencies
RUN npm install

# Step 5: Copy the rest of the application
COPY . .

# Step 6: Build the React app
RUN npm run build

# Step 7: Serve the app using a lightweight web server
FROM nginx:alpine
COPY --from=0 /app/build /usr/share/nginx/html

# Step 8: Expose port 80
EXPOSE 80

# Step 9: Start the server
CMD ["nginx", "-g", "daemon off;"]
