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
docker run devolution2409/lidlbot:stable -e BOT_USERNAME=<BOT USERNAME> -e OAUTH_TOKEN=<YOUR OAUTH TOKEN> -e ROOT_TWITCH_USERNAME=<YOUR TWITCH USERNAME>
```


#### Environment Variables

* `BOT_USERNAME` - The bot username
* `OAUTH_TOKEN` - The bot OAUTH token with chat permission (see below)
* `ROOT_TWITCH_USERNAME`  - Your username on twitch (some bot commands will only work if you are specified here)

#### OAUTH Token

To generate an OAUTH token that will be valid for the bot, please login in to twitch with the bot account, and go to this page: https://twitchapps.com/tmi/ .
Click generate and voila.


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

