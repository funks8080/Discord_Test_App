var Discord = require('discord.io');
var logger = require('winston');
var auth = require('./auth.json');

// Configure logger settings

logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, { colorize: true });

logger.level = 'debug';

// Initialize Discord Bot

var bot = new Discord.Client({ token: auth.token, autorun: true });

bot.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.username + ' - (' + bot.id + ')');
});

bot.on('message', function (user, userID, channelID, userMessage, evt)
{
    //console.log('author: ' + userID);
    if (user == 'Test_App') {
        // do nothing
        //console.log('Ignoring bot message!');
        return;
    }
    
    if (userMessage.substring(0, 1) == '!')
    {
        var args = userMessage.substring(1).split(' ');
        var cmd = args[0];
        var val = args[1];
        args = args.splice(1);

        switch(cmd) {
            // !ping
            case 'ping':
                bot.sendMessage({
                    to: channelID,
                    message: 'Pong!'
                });
                break;
            case 'budget':
                bot.sendMessage({
                    to: channelID,
                    message: 'TEST ONLY: ' + val + '!'
                });
                break;
        }
    }
    else
    {
        var budget = 0;
        var multiple = 1;
        var denom = userMessage.slice(-1);
        if(isNaN(denom))
        {
            if(denom == 'k' || denom == 'K')
            {
                multiple = 1000;
            }
            else if(denom == 'm' || denom == 'M')
            {
                multiple = 1000000;
            }
            else
            {
                bot.sendMessage({
                        to: channelID,
                        message: 'Invalid number denom of ' + denom + '! Please use \'K\' or \'M\'. Ex: 50K'
                });
                return;
            }
            budget = userMessage.substring(0, userMessage.length - 1)

            if(isNaN(budget))
            {
                bot.sendMessage({
                        to: channelID,
                        message: 'Please give me a number only!'
                });
                return;
            }
            budget = budget * multiple;
        }
        else
        {
            if(isNaN(userMessage))
                {
                bot.sendMessage({
                        to: channelID,
                        message: 'Please give me a number only!'
                });
                return;
            }
            budget = userMessage;
        }

        bot.sendMessage({
                to: channelID,
                message: 'Your new budget is set to ' + budget
        });

        var data = [ ['U'+userID, budget] ];
        let csvContent = data.map(e => e.join(",")).join("\n");
        const fs = require("fs");
        fs.appendFile("./data.csv", csvContent + "\r\n", (err) => {
            console.log(err || "done");
        });
    }
});