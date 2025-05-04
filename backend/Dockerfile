FROM node:18-alpine

WORKDIR /usr/src/app
COPY package.json ./
RUN npm install
COPY . .

RUN npm ci

ARG PORT=3000
ENV PORT=${PORT}
EXPOSE ${PORT}

# Run the application
CMD ["node", "-r", "dist/main.js"]