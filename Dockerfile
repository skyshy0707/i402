FROM nginx AS production-stage


RUN apt-get update && apt-get install -y npm
COPY ./backend /code/
WORKDIR /code
RUN chmod 775 package.json
RUN npm install

CMD node ./db/initDb.js; node api.js