FROM node:12

WORKDIR /usr/src/polkadot-overview

ARG ENVIRONMENT
ENV ENVIRONMENT=$ENVIRONMENT

COPY . .

RUN npm ci && \
    cd api && npm ci && \
    cd ../parser-light && npm ci && \
    cd ../ui && npm ci

EXPOSE 3001 4001

ENTRYPOINT ["/bin/sh", "/usr/src/polkadot-overview/docker-entrypoint.sh"]
