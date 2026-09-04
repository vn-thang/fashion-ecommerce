FROM node:22-alpine

WORKDIR /app


RUN apk add --no-cache tzdata
ENV TZ=Asia/Ho_Chi_Minh

COPY package*.json ./

RUN npm ci --omit=dev

COPY . .

RUN npx prisma generate

EXPOSE 3000

CMD ["npm", "start"]