# Stage 1: Build the React Router application
FROM node:18-alpine as build

WORKDIR /app

# Install yarn if needed
RUN apk add --no-cache yarn

# Copy package.json and yarn.lock
COPY sacco_frontend/package.json ./
COPY sacco_frontend/yarn.lock ./

# Install dependencies
RUN yarn install

# Copy the rest of the frontend code
COPY sacco_frontend/ ./

# Build the application
RUN yarn build

# Stage 2: Production environment
FROM node:18-alpine

WORKDIR /app

# Install yarn if needed
RUN apk add --no-cache yarn

# Copy package.json and yarn.lock
COPY sacco_frontend/package.json ./
COPY sacco_frontend/yarn.lock ./

# Install only production dependencies
RUN yarn install --production

# Copy built app from the build stage
COPY --from=build /app/build ./build
COPY --from=build /app/node_modules ./node_modules

# Expose the port the app runs on
EXPOSE 3000

# Start the application with react-router-serve
CMD ["yarn", "start"]