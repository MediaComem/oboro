# Builder Image
# =============
# Download tools, install and compile dependencies.
FROM node:8.17.0-alpine as builder

# * Install glibc and friends to compile bcrypt.
# * Create oboro user & group.
# * Install Bower & Gulp.
RUN apk add --no-cache \
      g++ \
      git \
      make \
      python && \
    mkdir -p /usr/src/app && \
    addgroup -S oboro && \
    adduser -S -G oboro oboro && \
    chown -R oboro:oboro /usr/src/app && \
    npm install -g bower gulp-cli

WORKDIR /usr/src/app
USER oboro:oboro

# Install dependencies.
COPY --chown=oboro:oboro .bowerrc bower.json package.json package-lock.json /usr/src/app/
RUN npm ci && \
    bower install

# Make a static build.
COPY --chown=oboro:oboro / /usr/src/app/
RUN gulp build --env production

# Production Image
# ================
# Serve the static application.
FROM nginx:1.19.0-alpine

LABEL maintainer="mei-admin@heig-vd.ch"

# * Clean up default web directory.
# * Create oboro user & group.
RUN addgroup -S oboro && \
    adduser -S -G oboro oboro && \
    rm -fr /usr/share/nginx/html/* && \
    chown oboro:oboro /usr/share/nginx/html

WORKDIR /usr/share/nginx/html

COPY --chown=oboro:oboro --from=builder /usr/src/app/dist/ /usr/share/nginx/html/
