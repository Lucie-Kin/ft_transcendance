FROM node:20-bullseye-slim

WORKDIR /auth

COPY package.json ./
RUN npm install

COPY . .

EXPOSE 3001

CMD ["sh", "-c", "npm run dev"]