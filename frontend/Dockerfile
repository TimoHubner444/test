# Stage 1: Build the Angular application
FROM node:16-alpine AS build

WORKDIR /usr/src/app

# Pass the API URL as an argument and set as environment variable
ARG APIURL
ENV APIURL ${APIURL}

COPY . .

# Create the environment.prod.ts dynamically
RUN echo "export const environment = {production: true, apiurl: '${APIURL}'};" > /usr/src/app/src/environments/environment.prod.ts

# Install dependencies
RUN npm install

# Build the Angular app for production
RUN npm run build --configuration=production

# Stage 2: Prepare for running tests
FROM node:16-alpine AS test

WORKDIR /usr/src/app

# Copy the application files from the build stage
COPY --from=build /usr/src/app /usr/src/app

# Install Angular CLI, Karma, and testing dependencies
RUN npm install -g @angular/cli@17  # Ensure Angular CLI is available for testing
RUN npm install  # Install dependencies
RUN npm install --save-dev karma karma-chrome-launcher karma-jasmine jasmine-core jasmine-spec-reporter  # Install Karma and necessary plugins for Chrome headless testing

# Install Chrome for headless testing
RUN apk add --no-cache \
    chromium \
    && ln -s /usr/bin/chromium /usr/bin/chrome \
    && apk add --no-cache --virtual .build-deps gcc g++ make python3 \
    && npm install

# Stage 3: Deploy the app using Nginx
FROM nginx

# Copy the custom Nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Copy the build output from the build stage
COPY --from=build /usr/src/app/dist/frontend/ /usr/share/nginx/html

# Expose the Nginx port
EXPOSE 80
