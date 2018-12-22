require('console-error');
require('console-info');
require('console-success');

var mongoose=require('mongoose');

// Exporting a new instance will de-facto create a singleton, which is what we need FeelsGoodMan 
class MongoDriver{
	constructor(){
		if (process.env.MONGO_DB_HOST === undefined || process.env.MONGO_DB_NAME === undefined ){
			console.error("[LIDLBOT]\tMongoDB environnement variables aen't defined properly. The bot won't be able to use stored commands, or any function that requires a database.");
		} else {
			
			this.username = process.env.MONGO_DB_USER;
			this.password = process.env.MONGO_DB_PASSWORD;
			this.host = process.env.MONGO_DB_HOST;
			this.dbname = process.env.MONGO_DB_NAME;
			//this.url = 'mongodb://' + this.username + ':' + this.password + '@' + this.host + ':27017/admin' // + this.dbname;
			this.url = 'mongodb://'+  this.host + ':27017/' + this.dbname;

			this.options = { 
useNewUrlParser: true,
			};

			this.connection = mongoose.connection;
			this.attempts = 0;

//			this.connection.on('open', function(db) {
//					});
			// once we are in, we reset attempts.
			this.connection.on('connected', () => {
					
				this.attempts = 0 ;			
				console.success("[LIDLBot]\t Successfully opened connection to MongoloidDB");
				console.info("[LIDLBot]\t Database is: " + this.connection.name);	
			});
			// now we connect
			this.ConnectAndRetry();
		}
	}//end constructor
	// Function to connect, and force it to retry before MAX_ATTEMPTS
	ConnectAndRetry(){
		// eShrug?
		var that = this;
		if (this.attempts < 60){
			let redactedURL = 'mongodb://' + this.username + ':<REDACTED>@' + this.host + ':27017/admin';
			console.info("[LIDLBot]\tAttempting to connect (" + this.attempts + ") to MongoloidDB: " + redactedURL );
			// setting time out to occur once it fails only if the number of unsuccessful attempt hasn't been reached
			mongoose.connect(this.url,this.options);
			this.connection.once('error', function(error) {
					that.attempts++; 
					console.error('[LIDLBot]\t' + error);
					//need to bind this else it will get assigned to another thing during timeout i guess
					// either that or do something like this:
					setTimeout( () => {that.ConnectAndRetry()},1000);
					});
		} else{
			console.warn("[LIDLBot}\tCouldn't connect to MongoloidDB");
		}

	} // end connect and try
	GetConnection(){
		return this.connection;
	}





} //end class MongoDriver
module.exports= new MongoDriver();
