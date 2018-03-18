var goblinNames = {};
module['exports'] = goblinNames;

var firstNames = [
    'Gorbag',
    'Skitz',
    'Flurg',
    'Dax',
    'Slurm',
    'Trux',
    'Skurm',
    'Flicks',
    'Rip',
    'Slag',
    'Teeks'
];

var lastNames = [
    'Rip',
    'Tear',
    'Burn',
    'Bite',
    'Filth',
    'Oz',
    'Puss',
    'Dirt',
    'Blood',
    'Slice',
    'Stab',
    'Knife',
    'Blade'
];

var lastLastNames = [
    'bag',
    'slag',
    'rixx',
    'lug',
    'tac',
    'riz',
    'cruz'
];

var randomFromList = function(list){
    return list[Math.floor(Math.random() * list.length)];
}

goblinNames.getName = function(){
    return [randomFromList(firstNames),' ', randomFromList(lastNames),randomFromList(lastLastNames)].join('');
}