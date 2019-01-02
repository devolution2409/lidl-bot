// url: "https://overrustlelogs.net/forsen%20chatlog/October%202018/userlogs/devoluti0n.txt"
module.exports = {
snitch: searchForLogs
}


let driver = require('../../lidl_core/MongoDriver.js');
require('console-info');
require('console-warn');
require('console-error');
require('console-success');
let util = require('../../lidl_core/util.js');
let mongoose = require('mongoose');



function searchForLogs(channel,context,params,commandName){
	let https = require("https");

	let month = new Date().getMonth();         // Get the month (0-11)
	let year = new Date().getFullYear();      // Get the four digit year (yyyy)	

	const monthNames = ["January", "February", "March", "April", "May", "June","July", "August", "September", "October", "November", "December"];
	//channel contain # we need to remove it
	//let url = "https://overrustlelogs.net/" + channel.substr(1) + "%20chatlog/" + monthNames[month]  + "%20" + year  +"/userlogs/" + context.username + ".txt"i
	
	let username;
	let chan;
	if (params.length && params.join(' ').trim() !== '' ){
		console.log("params:'" + params + "'");
		//username should be params[0]
		if (params[0].substr(0,1) === '@'){
			username = params[0].substr(1);
		} else {
			username = params[0];
		}
	} else{
		username = context.username;
	}

	if (channel.substr(0,1) === '#'){
		chan = channel.substr(1);
	} else{
		chan = channel;
	}

//	let url = "https://overrustlelogs.net/" + channel + "%20chatlog/" + monthNames[month]  + "%20" + year  +"/userlogs/" + username + ".txt"

let url = "https://api.gempir.com/channel/" + chan + "/user/" + username +  "/" + year + "/" +  month + 1;
	https.get(url, (resp) => {
			let data = '';
			let msg = '';
			// A chunk of data has been recieved.
			resp.on('data', (chunk) => {
					data += chunk;
					});

			// The whole response has been received. Print out the result.
			resp.on('end', () => {
					let logs = data.split(/[\r\n]+/);
					if (data.length){
						if (logs[0].includes("Failure reading log")){
							msg = 'No logs for this user'						
						}else{
							let enablers = new RegExp( /nigger|nigg|\bnig\b|niger|nigeria|nibba|nibb|snicker|asteroid 8766|pewdiepie|bridge|книга|book in russian|negro|kneegro|kneeger|kneegur|(\s|\.|\-|\_|\\|\/)*n(\s|\.|\-|\_|\\|\/)*i(\s|\.|\-|\_|\\|\/)*g(\s|\.|\-|\_|\\|\/)*g(\s|\.|\-|\_|\\|\/)*e(\s|\.|\-|\_|\\|\/)*r(\s|\.|\-|\_|\\|\/)*/, 'mi');
							
							var checkLogs = (array) => {
								let lacist = 0;
								for (let i = 0; array.length; i++){
									if (enablers.test(array[i]))  {
										lacist =  i;
										break;
									}
								}
								return lacist;
					
							};
							let k = checkLogs(logs)
							if (k){
								msg =  "Found something, sent PM cmonBruh";
								util.sendWhisper(context.username, logs[k]);
								console.log('HYPERBRUH !');
								console.log(logs[k]);

							} else {
								msg = "Nothing to snitch on for user: FeelsGoodMan ";
							}
								


						}
							util.sendMessage(channel,msg);	
					}

//					console.log(logs);

					});

	}).on("error", (err) => {
		console.log("Error: " + err.message);
		});





}



