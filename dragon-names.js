var dragonNames = {};
module['exports'] = dragonNames;

var firstNames = [
    'Kar',
    'Spul',
    'Trou',
    'Kill'
];

var firstNameEnding = [
    'thrax',
    'knox',
    'tark',
    'jur',
    'balg',
    'galk',
    'yur'
];

var lastNames = [
    'Petulent',
    'Devious',
    'Greedy',
    'Vile',
    'Cruel',
    'Vapid'
];


var randomFromList = function(list){
    return list[Math.floor(Math.random() * list.length)];
}

dragonNames.getName = function(){
    return [randomFromList(firstNames) + randomFromList(firstNameEnding),' the ', randomFromList(lastNames)].join('');
}