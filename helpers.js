const spaceMutiny = require('./space-mutiny.js');
const goblinNames = require('./goblin-names.js');
const dragonNames = require('./dragon-names.js');
const zombieNames = require('./zombie-names.js');
const outputProvider = require('./output-provider.js');
const colors = require('colors');

var helpers = {}
module['exports'] = helpers;

/// ------------------------ Helpers ------------------------

var lastUsedId = 0;
helpers.getId = function(){
    lastUsedId++;
    return lastUsedId;
}

helpers.roll = function(numberOfSides){
    return Math.floor(Math.random() * numberOfSides) + 1;
}

helpers.getHero = function(initiative){
    var peep = {
        id: helpers.getId(),
        name: '[' + spaceMutiny.getName() + ']',
        attacks: [
            {
                attackModifier: 4,
                damageModifier: 2,
                damageDice: 6,
                numberOfDamageDice: 1,
            }
        ],
        AC: 15,
        hitpoints: 10,
        initiativeRoll: initiative ? initiative : 0,
        kills: 0,
        targetId: -1,
        history: [],
        team: 0,
        preattackConditions: [],
        postattackConditions: []
    }
    return peep;
}

helpers.getGobo = function(initiative) {
    var gobo = {
        id: helpers.getId(),
        name:'[' + goblinNames.getName()+ ']',
        attacks: [
            {
                attackModifier: 2,
                damageModifier: 0,
                damageDice: 4,
                numberOfDamageDice: 1,
            }
        ],
        AC: 10,
        hitpoints: 4,
        initiativeRoll: initiative ? initiative : 0,
        kills: 0,
        targetId: -1,
        history: [],
        team: 0,
        preattackConditions: [],
        postattackConditions: []
    }
    return gobo;
}

helpers.getZombo = function(initiative) {
    var zombo = {
        id: helpers.getId(),
        name:'[' + zombieNames.getName()+ ']',
        attacks: [
            {
                attackModifier: 3,
                damageModifier: 4,
                damageDice: 8,
                numberOfDamageDice: 2,
            }
        ],
        AC: 8,
        hitpoints: 22,
        initiativeRoll: initiative ? initiative : 0,
        kills: 0,
        targetId: -1,
        history: [],
        team: 0,
        preattackConditions: [],
        postattackConditions: [ function(attacker, target, attackIndex){
            // console.log('Hitpoints ' + target.hitpoints);
            var saveRoll = helpers.roll(20);
            // console.log('Save roll ' + saveRoll);
            if(target.hitpoints <= 0 && saveRoll > 10) {
                target.hitpoints = 1;
                target.history.push({ type: 'healed', source: target.name });
                outputProvider.miss(target.name + ' just wont die! They return to '+ ('(' + target.hitpoints + ')').green + ' HP.');
            };
        }]
    }
    return zombo;
}

helpers.getGnoll = function(initiative) {
    var gnoll = {
        id: helpers.getId(),
        name:'[' + goblinNames.getName()+ ']',
        attacks: [
            {
                attackModifier: 4,
                damageModifier: 2,
                damageDice: 6,
                numberOfDamageDice: 1,
            },
            {
                attackModifier: 4,
                damageModifier: 2,
                damageDice: 6,
                numberOfDamageDice: 1,
            }
        ],
        AC: 14,
        hitpoints: 22,
        initiativeRoll: initiative ? initiative : 0,
        kills: 0,
        targetId: -1,
        history: [],
        team: 0,
        preattackConditions: [],
        postattackConditions: []
    }
    return gnoll;
}

helpers.getMinotaurSkeleton = function(initiative) {
    var skele = {
        id: helpers.getId(),
        name: '[Skelotaur]'.yellow,
        attacks: [
            {
                attackModifier: 6,
                damageModifier: 4,
                damageDice: 12,
                numberOfDamageDice: 2,
            }
        ],
        AC: 12,
        hitpoints: 67,
        initiativeRoll: initiative ? initiative : 0,
        kills: 0,
        targetId: -1,
        history: [],
        team: 1,
        preattackConditions: [],
        postattackConditions: []
    }
    return skele;
};

helpers.getDragon = function(initiative) {
    var dragon = {
        id: helpers.getId(),
        name: '[' + dragonNames.getName() + ']',
        attacks: [
            {
                attackModifier: 14,
                damageModifier: 8,
                damageDice: 10,
                numberOfDamageDice: 2,
            },
            {
                attackModifier: 14,
                damageModifier: 8,
                damageDice: 10,
                numberOfDamageDice: 2,
            },
            {
                attackModifier: 14,
                damageModifier: 8,
                damageDice: 10,
                numberOfDamageDice: 2,
            }
        ],
        AC: 19,
        hitpoints: 256,
        initiativeRoll: initiative ? initiative : 0,
        kills: 0,
        targetId: -1,
        history: [],
        team: 1,
        preattackConditions: [],
        postattackConditions: []
    }
    return dragon;
}

helpers.getStory = function(combatant) {
    return combatant.history.map(function(item, index){
        var summary;
        switch (item.type) {
            case 'hit':
                summary = 'Hit ' + item.target + ' for ' + item.damage + ' damage.';
                break;
            case 'gotHit':
                summary = 'Got hit by ' + item.source + ' for ' + item.damage + ' damage.';
                break;
            case 'kill':
                summary = 'Defeated ' + item.target;
                break;
            case 'killed':
                summary = 'I dead! ' + item.source + ' beat me :('
                break;
            case 'healed':
                summary = 'Healed.'
                break;
            default:
                summary = "*shrug*";
                break;
        }
        return summary;
    });
}