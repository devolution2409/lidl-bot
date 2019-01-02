module.exports = {
	ping: pong

}
function pong(target,obj,params,commandsName){
        let util = require ('../../lidl_core/util.js');
        let msg = "I'm here :wave: forsenE";
        util.sendMessage(target,msg);

}



