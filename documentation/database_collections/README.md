This bot uses MongoDB to store commands as a json.

The default database is named lidlbot, but this can be changed with an environnement variable at runtime.

The needed collection are:
- config
- commands


config holds the data about bot administrators (who can run admin only commands such as reboot) as well as information about which channel the bot should log on to, blacklisted commands, cooldown etc.

commands holds simple text commands that can be added while the bot is running (you'll need to `!reload commands`) they can be simple such as !command => respone, or more complex. See the !fact command example if you wish to make a more complex command
