FROM node:6

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json /usr/src/app/
RUN npm install -g gulp && npm install

COPY . /usr/src/app
RUN gulp build

CMD [ "node", "dist/server" ]
