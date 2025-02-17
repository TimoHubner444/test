FROM node:16
WORKDIR /usr/src/app

COPY . .
RUN npm install
RUN mvn clean install

CMD ["npm","start","mvn"]
