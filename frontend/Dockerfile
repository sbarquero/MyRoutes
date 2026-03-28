# Builder dependencies
FROM node:20.3.1-alpine3.18 AS dev-deps
WORKDIR /app
COPY package.json package.json
RUN npm install

# Builder
FROM node:20.3.1-alpine3.18 as builder
WORKDIR /app
COPY --from=dev-deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Run APP in nginx web server
FROM nginx:1.25.1-alpine3.17 as prod
EXPOSE 80
COPY --from=builder /app/dist /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx/nginx.conf /etc/nginx/conf.d
CMD [ "nginx", "-g", "daemon off;" ]
