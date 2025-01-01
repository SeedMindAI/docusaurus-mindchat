FROM node:21 AS builder

RUN mkdir -p /app
WORKDIR /app
COPY package.json package-lock.json ./
COPY yarn.lock ./
COPY tsconfig.json ./
COPY tsconfig.base.json ./
COPY demo ./demo
COPY lerna.json .
COPY packages/docusaurus-ai ./packages/docusaurus-ai
RUN yarn install && yarn build


FROM nginx:1.25.1-alpine AS runtime
WORKDIR /app
COPY --from=builder /app/demo/build ./
COPY nginx.conf /etc/nginx/conf.d/default.conf

