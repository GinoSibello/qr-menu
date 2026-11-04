FROM node:20-alpine

WORKDIR /app

COPY package.json ./
COPY prisma ./prisma
COPY tsconfig.json ./
COPY src ./src

RUN npm install \
 && npx prisma generate \
 && npm run build

EXPOSE 4000

CMD ["sh", "-c", "npx prisma migrate deploy && node dist/prisma/seed.js && node dist/src/index.js"]
