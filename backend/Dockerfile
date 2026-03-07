FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install --omit=dev

COPY . .

RUN npx prisma generate && mkdir -p /app/uploads

EXPOSE 3000

CMD ["npm", "start"]
