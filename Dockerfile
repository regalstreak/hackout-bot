FROM node:14-alpine

WORKDIR /app
COPY . .
RUN ls -a
RUN yarn
RUN yarn build

CMD [ "yarn", "start" ]
