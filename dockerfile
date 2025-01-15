FROM node:10-alpine AS build
WORKDIR /app
COPY . .
RUN npm install
CMD ["npm","start"]