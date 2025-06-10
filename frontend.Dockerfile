FROM node:lts-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm install
RUN npm install sweetalert2


COPY . .
RUN npm run build

# Production stage
FROM nginx:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]