require('console-error');
require('console-info');
require('console-success');

var mongoose=require('mongoose');

class MongoDriver{
	constructor(){
		if (process.env.MONGO_DB_USER === undefined || process.env.MONGO_DB_PASSWORD === undefined || process.env.MONGO_DB_HOST === undefined || process.env.MONGO_DB_NAME === undefined ){
			console.error("[LIDLBOT]\tMongoDB environnement variables aen't defined properly. The bot won't be able to use stored commands, or any function that requires a database.");
		} else {

			this.username = process.env.MONGO_DB_USER;
			this.password = process.env.MONGO_DB_PASSWORD;
			this.host = process.env.MONGO_DB_HOST;
			this.dbname = process.env.MONGO_DB_NAME;
			this.url = 'mongodb://' + this.username + ':' + this.password + '@' + this.host + ':27017/admin';


			this.options = { 
useNewUrlParser: true,
//useMongoClient: true //required to remove the "server name must be a string thing"
			};

			this.connection = mongoose.connection;

			this.attempts = 0;

			// once we are in, we reset attempts.
			this.connection.on('open', function() {
					this.attempts = 0 ;			
					console.success("[LIDLBot]\t Successfully connected to MongoloiDB");
					});
			// now we connect
			this.connectAndRetry();
		}
	}//end constructor
	// Function to connect, and force it to retry before MAX_ATTEMPTS
	connectAndRetry(){
		// eShrug?
		var that = this;
		if (this.attempts < 60){
			let redactedURL = 'mongodb://' + this.username + ':<REDACTED>@' + this.host + ':27017/admin';
			console.info("[LIDLBot]\tAttempting to connect (" + this.attempts + ") to MongoloidDB: " + redactedURL );
			mongoose.connect(this.url,this.options);

			// setting time out to occur once it fails only if the number of unsuccessful attempt hasn't been reached

			this.connection.once('error', function(error) {
					that.attempts++; 
					console.error('[LIDLBot]\t' + error);
					//need to bind this else it will get assigned to another thing during timeout i guess
					// either that or do something like this:
					setTimeout( () => {that.connectAndRetry()},1000);
					});
		} else{
			console.warn("[LIDLBot}\tCouldn't connect to MongoloidDB");
		}

	}

} //end class MongoDriver
module.exports = {
client: new MongoDriver()
}
