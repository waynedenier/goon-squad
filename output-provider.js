const logSymbols = require('log-symbols');
var outputProvider = {};
module['exports'] = outputProvider;

outputProvider.mode = 'full';

outputProvider.low = function(msg){
    console.log(logSymbols.info,msg);
};

outputProvider.high = function(msg){
    console.log(logSymbols.success,msg);
};

outputProvider.attack = function(msg){
    console.log(logSymbols.success,msg);
};

outputProvider.miss = function(msg){
    console.log(logSymbols.warning,msg);
};

outputProvider.kill = function(msg){
    console.log(logSymbols.error,msg);
};

outputProvider.linebreak = function(){
    console.log();
};