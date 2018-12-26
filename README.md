# LIDL BOT

A lightweight twitch bot ! (hopefully)

## Getting Started

These instructions will cover how to get started using lidl bot

### Prerequisities


In order to run this container you'll need docker installed.

* [Windows](https://docs.docker.com/windows/started)
* [OS X](https://docs.docker.com/mac/started/)
* [Linux](https://docs.docker.com/linux/started/)

### Usage

#### Running the bot

To run the bot simply pull the image from docker store/docker hub and run it.
You have to specify environment variable for the bot authentication credentials. 
The list of all needed environment variables can be found below.

```shell
docker run -d -e BOT_USERNAME=supa_bot -e OAUTH_TOKEN:123TriEasy -e MONGO_DB_USER:root -e MONGO_DB_PASSWORD:example -e MONGO_DB_HOST:mongo -e MONGO_DB_NAME:lidlbot devolution2409/lidlbot:nightly

```

#### Or with docker-compose or docker stack deploy
```
version: '3.1'

services:

  mongo:
    image: mongo:4.0.4-xenial
    restart: always
    volumes:
      - ./mongo_data/:/data/db/
  mongo-express:
    image: mongo-express
    restart: always
    ports:
      - 8081:8081
  
 lidlbot:
     image: lidlbot:nightly
     restart: always
     build:
       context: .
     depends_on:
       - mongo
     environment:
       MONGO_DB_USER: root
       MONGO_DB_PASSWORD: example
       MONGO_DB_HOST: mongo
       MONGO_DB_NAME: lidlbot
       BOT_USERNAME: lidler_bot
       OAUTH_TOKEN: wh2qh1sforsenExq69vnaby1s
```
  
#### Environment Variables

* `BOT_USERNAME` - The bot username
* `OAUTH_TOKEN` - The bot OAUTH token with chat permission (see below). Will accept both the full token (oauth:token) or just the token part.
* `MONGO_DB_USER` - The mongo db account username
* `MONGO_DB_PASSWORD` - self-explainatory
* `MONGO_DB_HOST` -  Hostname or url of the mongo db server. (without mongodb://) If you are using docker make sure that the mongo db container and the lidlbot are on the same user-defined network
* `MONGO_DB_NAME` - Name of the database the bot will be using


#### OAUTH Token

To generate an OAUTH token that will be valid for the bot, please login in to twitch with the bot account, and go to this page: https://twitchapps.com/tmi/ .
Click generate and voila.

#### Additional info

If you are using the provided docker-compose file, and the mongoDB image throws some error, you can try to use the provided `clean_docker_garbage.sh` script.
It will clean up docker temporary and trailing images, and can sometime make the mongoDB work again.
It won't delete any image used by a *running*  container.

### (Re-)Building the bot 
#### Dockerfile

If you happen to git clone this repository, the following Dockerfile will allow you to launch the bot on docker

```

FROM node:8.14-alpine

WORKDIR /opt/app/

COPY ./package*.json /opt/app/

RUN npm install

COPY app.js /opt/app/

RUN mkdir lidl_core && mkdir lidl_modules

COPY ./lidl_core/* /opt/app/lidl_core/

COPY ./lidl_modules/* /opt/app/lidl_modules/

ENV OAUTH_TOKEN:<oauth_token> BOT_USERNAME=<bot_username>

CMD ["node","app.js"]

```
### TODO

 - [ ] Different folders for sync and async modules
 - [ ] Standardize the way modules send back data?
 - [ ] Template for both async and sync modules
 - [ ] Add env variables to mongo-express so that the web interface requires login 

## Built With

* Node.js



## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the 
[tags on this repository](https://github.com/your/repository/tags). 

## Authors

* **Devolution** - *eShrug* - [Github](https://github.com/devolution2409)

See also the list of [contributors](https://github.com/devolution2409/lidl-bot/contributors) who 
participated in this project.

## Thanks
* **CBeeni** - *help with mongo request*

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

