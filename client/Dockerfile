FROM node:22 AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
#ARG BASE_PATH=/
#ENV BASE_PATH=$BASE_PATH
RUN npm run build

FROM nginx:stable
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
