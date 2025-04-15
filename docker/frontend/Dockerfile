# Stage 1: Build the React Router application
FROM node:18-alpine as build

WORKDIR /app

# Copy package.json and package-lock.json
COPY sacco_frontend/package*.json ./
# Copy Yarn lock file if it exists
COPY sacco_frontend/yarn.lock ./

# Install dependencies
RUN npm ci

# Copy the rest of the frontend code
COPY sacco_frontend/ ./

# Build the application
RUN yarn build

# Stage 2: Production environment
FROM node:18-alpine

WORKDIR /app

# Copy package.json
COPY sacco_frontend/package*.json ./

# Install only production dependencies
RUN yarn install --production

# Copy built app from the build stage
COPY --from=build /app/build ./build
COPY --from=build /app/node_modules ./node_modules

# Expose the port the app runs on
EXPOSE 3000

# Start the application with react-router-serve
CMD ["npm", "run", "start"]