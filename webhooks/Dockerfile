
FROM node:14 as builder
WORKDIR /webhooks
COPY . ./
RUN npm install
RUN npm run compile


FROM node:14-slim
WORKDIR /webhooks
COPY --from=builder /webhooks ./
EXPOSE ${PORT}
CMD npm run start