FROM node:13.14.0
WORKDIR /app
COPY . .
RUN npm install
CMD ["npm","start"]

# docker build -t express-office-lunch .
# docker run -d -p 3012:3001 express-office-lunch