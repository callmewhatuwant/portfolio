# This Dockerfile builds and packages a Node.js application using Nginx to serve the static files.
# It supports multi-platform builds and ensures a minimal production image by using a small webserver image.
FROM alpine:3.23.0 AS builder
ARG TARGETOS
ARG TARGETARCH

# Install dependencies.
RUN apk add --no-cache \
    nodejs \
    npm 

WORKDIR /app
# Copy package.json and lock file.
COPY package.json package.json
COPY package-lock.json package-lock.json
# Cache deps before building and copying source so that we don't need to re-download as much
# and so that source changes don't invalidate our downloaded layer.
# Use clean npm install: npm ci.
RUN npm ci

# copy source code (relies on .dockerignore to filter)
# or you could clone the git repo
COPY . .

## build
# build with npm
RUN npm run build

# Use a minimal base image to package the code.
# For a binary I would prefer a distroless image like: gcr.io/distroless/static:nonroot.
# Refer to https://github.com/GoogleContainerTools/distroless for more details.
FROM nginxinc/nginx-unprivileged:alpine3.22-perl

USER root
# Update packages if you need to I would recommend specifying the software and version.
# This is just for testing.
RUN apk update && apk upgrade --no-cache

## Copy your files after the npm build.
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose webserver port: This is the default port for our nginx rootless container.
# Check which port your web server listens on.
EXPOSE 8080

# We use a nonroot user.
# nginx = 101:101
USER nginx

# Now start nginx.
CMD ["nginx", "-g", "daemon off;"]