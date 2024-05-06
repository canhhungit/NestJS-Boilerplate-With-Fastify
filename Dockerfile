FROM node:18-alpine AS development

WORKDIR /usr/src/app

COPY package.json yarn.lock ./
RUN apk add git tzdata
ENV TZ="Asia/Ho_Chi_Minh"
RUN yarn

COPY . .

RUN yarn run build

EXPOSE 3000

ENTRYPOINT ["node", "dist/main"]