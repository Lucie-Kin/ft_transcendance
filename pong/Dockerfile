FROM node:20-bullseye-slim
WORKDIR /app
COPY package*.json ./
RUN	npm install \
	npm install typescript
COPY . .
COPY src/index.html dist/
RUN npx tsc
EXPOSE 3000
CMD ["npx", "serve", "dist"]
