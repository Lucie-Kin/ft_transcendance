FROM node:20-bullseye-slim

WORKDIR /webapp

COPY package.json package-lock.json ./
RUN npm install

COPY . .

EXPOSE 5173

CMD ["sh", "-c", "npm run dev"]
