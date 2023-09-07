FROM node:18
ENV NODE_ENV=production
WORKDIR /ti12-ar-cardmaker
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile
COPY . .
CMD [ "yarn", "start" ]