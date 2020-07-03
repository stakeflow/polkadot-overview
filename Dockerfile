FROM node:12

WORKDIR /usr/src/polkadot-overview

COPY . .

RUN npm ci && \
    cd api && npm ci && \
    cd ../parser-light && npm ci && \
    cd ../ui && npm ci

EXPOSE 3001 4000

CMD ["npm", "run", "dev"]
