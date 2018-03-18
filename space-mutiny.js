var spaceMutiny = {};
module['exports'] = spaceMutiny;

var firstNames = [
    'Bulk',
    'Fridge',
    'Punch',
    'Brick',
    'Hammer',
    'Stern',
    'Boom',
    'Pike',
    'Chunk'
];

var prefix = [
    '',
    '',
    '',
    'Mc',
    'Von'
];

var lastNames = [
    'Large',
    'Slab',
    'Launch',
    'Huge',
    'Blast',
    'Explode',
    'Boom',
    'Man',
    'Dong',
    'Vast'
];

var lastLastNames = [
    'meat',
    'chest',
    'missle',
    'bone',
    'drill',
    'stone',
    'fight',
    'drive',
    'slam',
    'jolt',
    'blast',
    'drive'
];

var randomFromList = function(list){
    return list[Math.floor(Math.random() * list.length)];
}

spaceMutiny.getName = function(){
    return [randomFromList(firstNames),' ', randomFromList(prefix), randomFromList(lastNames),randomFromList(lastLastNames)].join('');
}