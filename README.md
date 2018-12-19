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

#### Container Parameters

To run the bot simply pull the image from docker store/docker hub and run it.
You have to specify environement variable for the bot authentication credentials. 

```shell
docker run -d devolution2409/lidlbot:stable -e BOT_USERNAME=<BOT USERNAME> -e OAUTH_TOKEN=<YOUR OAUTH TOKEN>
```


#### Environment Variables

* `BOT_USERNAME` - The bot username
* `OAUTH_TOKEN` - The bot OAUTH token with chat permission (see below)
* `ROOT_TWITCH_USERNAME`  - Your username on twitch (some bot commands will only work if you are specified here)

#### OAUTH Token

To generate an OAUTH token that will be valid for the bot, please login in to twitch with the bot account, and go to this page: https://twitchapps.com/tmi/ .
Click generate and voila.

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
#### Or with docker-compose or docker stack

```
#docker-compose.yaml

version: '3.1'

services:

  mongo:
    image: mongo:4.0.4-xenial
    restart: always
    environment:
      MONGO_INITDB_ROOT_USERNAME: root
      MONGO_INITDB_ROOT_PASSWORD: example
#  mongo-express:
#    image: mongo-express
#    restart: always
#    ports:
#      - 8081:8081
#    environment:
#      ME_CONFIG_MONGODB_ADMINUSERNAME: root
#      ME_CONFIG_MONGODB_ADMINPASSWORD: example
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
       BOT_USERNAME: <BOT_USERNAME>
       OAUTH_TOKEN: <OAUTH TOKEN>

```


## Built With

* Node.js



## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the 
[tags on this repository](https://github.com/your/repository/tags). 

## Authors

* **Devolution** - *eShrug* - [Github](https://github.com/devolution2409)

See also the list of [contributors](https://github.com/devolution2409/lidl-bot/contributors) who 
participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

