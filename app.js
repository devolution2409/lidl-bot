require('./lidl_core/core.js');



//catching sigint to be able to close the bot with ctrl + c from docker
process.on('SIGINT', function(){
	console.log('\nStopping gracefully..');
	process.exit(0);
});

