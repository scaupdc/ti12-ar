FROM node:18
ENV HOST=0.0.0.0 PORT=3000 NODE_ENV=production
WORKDIR /ti12-ar-frontend
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile
COPY . .
RUN yarn build
EXPOSE 3000
CMD [ "yarn", "start" ]