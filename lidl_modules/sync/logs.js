// url: "https://overrustlelogs.net/forsen%20chatlog/October%202018/userlogs/devoluti0n.txt"
module.exports = {
logs: getLogsUrl
}


let driver = require('../../lidl_core/MongoDriver.js');
require('console-info');
require('console-warn');
require('console-error');
require('console-success');
let util = require('../../lidl_core/util.js');
let mongoose = require('mongoose');



function getLogsUrl(channel,context,params,commandName){
	let https = require("https");

	let month = new Date().getMonth();         // Get the month (0-11)
	let year = new Date().getFullYear();      // Get the four digit year (yyyy)	

	const monthNames = ["January", "February", "March", "April", "May", "June","July", "August", "September", "October", "November", "December"];
	//channel contain # we need to remove it
	//let url = "https://overrustlelogs.net/" + channel.substr(1) + "%20chatlog/" + monthNames[month]  + "%20" + year  +"/userlogs/" + context.username + ".txt"i
	
	let username;

	if (params){
		//username should be params[0]
		if (params[0].substr(0,1) === '@'){
			username = params[0].substr(1);
		} else {
			username = params[0];
		}
		if (params[1].substr(0,1) === '#'){
			chan = params[1].substr(1);
		}else if (params[1]){
			chan = params[1];
		}
	} else{
		username = context.username;
	}


	let url = "https://overrustlelogs.net/" + chan + "%20chatlog/" + monthNames[month]  + "%20" + year  +"/userlogs/" + username + ".txt"
	let otherUrl = "https://api.gempir.com/channel/" + chan + "/user/" + username +  "/" + year + "/" +  month + 1;

	util.sendMessage(channel, "@" + context.username + ": " + otherUrl + "  forsenE");




}



