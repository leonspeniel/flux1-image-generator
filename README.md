# Flux1 Pro Image Generator

Flux1 Pro Image Generator is a React-based web application that allows users to generate AI-based images using the Black Forest Labs API. Users can provide their API key and a custom prompt to generate images seamlessly.

---

## Features
- Enter an API key securely.
- Input multi-line prompts for detailed image generation.
- View the generated image and open it in full size in a new tab.
- Shimmer effect or loading animation while the image is being generated.

---

## Prerequisites
- **Node.js**: Install Node.js (version 16 or later recommended) from [Node.js Official Website](https://nodejs.org/).
- **NPM**: Comes bundled with Node.js. Ensure it is installed.
- **Docker**: If you plan to containerize the app, install Docker from [Docker Official Website](https://www.docker.com/).

---

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/leonspeniel/flux1-image-generator.git
   cd flux1-image-generator
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open your browser and navigate to `http://localhost:3000` to access the application.

---

## Project Structure

```
flux1-image-generator/
├── public/              # Static files
├── src/                 # Source code
│   ├── App.js           # Main React component
│   ├── App.css          # Styling for the app
│   ├── index.js         # Entry point of the app
│   └── ...
├── package.json         # Project metadata and dependencies
└── Dockerfile           # Docker configuration
```

---

## Dockerization

### **Step 1: Create a Docker Image**

1. Build the Docker image:
   ```bash
   docker build -t react-flux1-image-generator .
   ```

2. Run the Docker container:
   ```bash
   docker run -d -p 3000:80 react-flux1-image-generator
   ```

3. Access the application:
   Open your browser and navigate to `http://localhost:3000`.

### **Dockerfile Explanation**

The `Dockerfile` used in this project:

```dockerfile
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
```

---

## Contributing
Feel free to fork this repository, create a new branch, and submit a pull request with your improvements!

---

## Acknowledgements
- **Black Forest Labs** for their API.
- **React** for the robust front-end framework.
- **Nginx** for lightweight web serving.

