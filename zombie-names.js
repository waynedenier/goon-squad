var zombieNames = {};
module['exports'] = zombieNames;

var firstNames = [
    'Percival',
    'Bartholemew',
    'Poindexter',
    'Reginald',
    'Maxamillion',
    'Trevor',
    'Terrance',
    'Samson',
    'Cecil',
];

var prefix = [
    '',
    '',
    'Mc',
    'Von'
];

var lastNames = [
    'stein',
    'son',
];


var randomFromList = function(list){
    return list[Math.floor(Math.random() * list.length)];
}

zombieNames.getName = function(){
    return [randomFromList(firstNames), ' ', randomFromList(prefix), 'Zombie', randomFromList(lastNames)].join('');
}