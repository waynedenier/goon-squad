const logSymbols = require('log-symbols');
const colors = require('colors');
const helpers = require('./helpers.js');

colors.setTheme({
    damageText: ['white', 'bgRed']
});

/// ------------------------ Providers ------------------------

var outputProvider = {
    mode: 'full',
    low: function(msg){
        console.log(logSymbols.info,msg);
    },
    high: function(msg){
        console.log(logSymbols.success,msg);
    },
    attack: function(msg){
        console.log(logSymbols.success,msg);
    },
    miss: function(msg){
        console.log(logSymbols.warning,msg);
    },
    kill: function(msg){
        console.log(logSymbols.error,msg);
    },
    linebreak: function(){
        console.log();
    }
};

/// ------------------------ Functions ------------------------

var roll = function(numberOfSides){
    return Math.floor(Math.random() * numberOfSides) + 1;
}

var chooseTarget = function(attacker, combatants){
    // see if the attacker already has a target
    if(attacker.targetId != -1){
        var currentTarget = combatants.filter(function(item){
            return item.id == attacker.targetId;
        })[0];

        // if the target is still alive, keep attacking it
        if(currentTarget.hitpoints > 0)
            return currentTarget;
    }

    // find new eligable targets
    var targets = combatants.filter(function(item, index) {
        return item.id != attacker.id && item.hitpoints > 0;
    })

    var targetIndex = Math.round(Math.random() * (targets.length - 1));
    var target = targets[targetIndex];

    // Choose new target
    attacker.targetId = target ? target.id : -1;
    return target;
}

var attack = function(attacker, target, attackIndex){
    //roll to hit
    var attackHits = (attacker.attacks[attackIndex].attackModifier + roll(20)) >= target.AC;

    if(!attackHits){
        outputProvider.miss(attacker.name + ' missed ' + target.name);
        return;
    }

    var damageRoll = 0;

    for (let i = 0; i < attacker.attacks[attackIndex].numberOfDamageDice; i++) {
        damageRoll = damageRoll + roll(attacker.attacks[attackIndex].damageDice);     
    }

    var totalDamage = attacker.attacks[attackIndex].damageModifier + damageRoll;

    target.history.push({ type: 'gotHit', damage: totalDamage, source: attacker.name, target: target.name });
    target.hitpoints = target.hitpoints - totalDamage;

    attacker.history.push({ type: 'hit', damage: totalDamage, source: attacker.name, target: target.name });

    outputProvider.attack(attacker.name + ' hits ' + target.name + ' for ' +
        ('(' + totalDamage.toString() + ')').damageText + ' damage.');
}

var sortByInitiative = function(a,b){
    if(a.initiativeRoll < b.initiativeRoll){
        return 1;
    } else if(a.initiativeRoll > b.initiativeRoll) {
        return -1;
    } else {
        return 0;
    }
};

var sortByKills = function(a,b){
    if(a.kills < b.kills){
        return 1;
    } else if(a.kills > b.kills) {
        return -1;
    } else {
        return 0;
    }
};

var round = function(combatants){
    var sortedCombatants = combatants.sort(sortByInitiative);
    for (let i = 0; i < sortedCombatants.length; i++) {
        const current = sortedCombatants[i];
        if(current.hitpoints > 0){
            var otherTeam = sortedCombatants.filter(function(item){ return item.team != current.team});
            
            for (let j = 0; j < current.attacks.length; j++) {
                var target = chooseTarget(current, otherTeam);
                if(target){
                    attack(current, target, j);
                    if(target.hitpoints <= 0){
                        current.kills++;
                        current.history.push({ type: 'kill', source: current.name, target: target.name });
                        target.history.push({ type: 'killed', source: current.name, target: target.name });
                        outputProvider.kill(target.name + ' defeated' + '!');
                    }
                }
                else
                {
                    outputProvider.low(current.name + ' has no one to fight.');
                }
            }
        }
    }
}

var colorCode = function(name, i){
    switch (i) {
        case 0:
            return name.cyan;
            break;
        case 1:
            return name.green;
            break;
        case 2:
            return name.yellow;
            break;
        case 3:
            return name.magenta;
            break;
        default:
            return name;
            break;
    }
}

var battle = function(){
    // getChallengers with initiative
    var totalCombatants = 6;
    var totalTeams = 2;
    var combatants = [];

    // for (let i = 0; i < totalCombatants; i++) {
    //     var hero = helpers.getGobo(roll(20));
    //     hero.team = (i % totalTeams);
    //     hero.name = colorCode(hero.name, hero.team);
    //     combatants.push(hero);  
    // }

    for (let i = 0; i < 4; i++) {
        var hero = helpers.getHero(roll(20));
        hero.team = 0;
        hero.name = hero.name.cyan;
        combatants.push(hero);  
    }

    for (let i = 0; i < 2; i++) {
        var hero = helpers.getZombo(roll(20));
        hero.team = 1;
        hero.name = hero.name.yellow;
        combatants.push(hero);  
    }

    //combatants.push(minotaurSkeleton);

    // for (let i = 0; i < 12; i++) {
    //     var gobo = helpers.getGobo(roll(20));
    //     gobo.team = 1;
    //     gobo.name = gobo.name.green;
    //     combatants.push(gobo);  
    // }

    var survivingTeams = 2;
    var roundCounter = 1;

    while (survivingTeams > 1 && roundCounter < 100) {
        outputProvider.linebreak();
        outputProvider.low('----- [Round ' + roundCounter + '. FIGHT!] -----');
        
        round(combatants);

        var knockoutCount = combatants.filter(function(item){ return item.hitpoints <= 0; }).length;
        var survivors = combatants.filter(function(item){return item.hitpoints > 0;});
        var summaries = survivors.map(function(item){ return item.name + ' Team(' + item.team + ')' + " HP(" + item.hitpoints + ') '});
        
        outputProvider.linebreak();
        outputProvider.high('----- [Round ' + roundCounter + '. OVER] Knockouts: ' + knockoutCount +
            //', Combatants remaining: ' + summaries.join(', ') + 
            ' -----');
        
        var teamSurvivors = [];
        for (let i = 0; i < totalTeams; i++) {
            teamSurvivors.push(0);          
        }

        survivors.forEach(element => {
            teamSurvivors[element.team]++;
        });

        var teamSummary = teamSurvivors.map(function(item, i){
            return 'Team ' + i + ' (' + item + ')';
        }).join(', ');

        outputProvider.high('---- Team Strength: ' + teamSummary + ' ----');

        survivingTeams = teamSurvivors.filter(function(item){ return item > 0; }).length;
        
        roundCounter++;
    }

    var summaries = combatants.map(function(item){
        return '\n' + item.name + ' (HP:' + item.hitpoints + ', Kills: ' + item.kills + ')';
    });
    
    outputProvider.linebreak();
    outputProvider.high('----- Final results: ' + summaries.join(', ') + ' -----');
    
    var winner = combatants.filter(function(item){return item.hitpoints > 0; }).pop();
    outputProvider.linebreak();
    outputProvider.high('-> Team ' + winner.team + ' WINS! <-');
    
    outputProvider.linebreak();
    var killRankings = combatants.sort(sortByKills);
    var leader = killRankings.reverse().pop();
    outputProvider.high('-> ' + leader.name + ' (Team ' + leader.team + ') had the most kills: ' + leader.kills + ' <-');

    outputProvider.high('-- The story of ' + leader.name + ' --');
    var story = helpers.getStory(leader);
    story.forEach(item => {
        outputProvider.high('- ' + item + ' -');
    });
}

battle();


/// ------------------------ Tests ------------------------

var storyTest = function(){
    var hero = getHero();

    hero.history.push({ type: 'gotHit', damage: 4, source: 'some asshole', target: 'me' });
    hero.history.push({ type: 'hit', damage: 10, source: 'me', target: 'some asshole' });
    hero.history.push({ type: 'kill', source: 'me', target: 'some asshole' });
    hero.history.push({ type: 'gotHit', damage: 10, source: 'another dude', target: 'me' });
    hero.history.push({ type: 'killed', source: 'another dude', target: 'me' });

    var story = getStory(hero);

    story.forEach(item => {
        console.log(item);
    });
}
//storyTest();

// Fixed: switched from ((sides - 1) * rand) rounded, to (sides * rand) floored
// Flaws in probability. All outcomes on 20 sider are 5.2% likely except 1s and 20s which are only 2.6% likely.
// This means that the lowest and highest outcomes only happen at half the expected rate??
var diceTesting = function(sides, trials){
    var outcomes = [];

    for(var j=0;j<sides;j++){
        outcomes[j] = 0;
    }

    for(var j=0;j<trials;j++){
        outcomes[roll(sides)-1]++;
    }

    console.log('[Number of trials for d' + sides + ': ' + trials + ']');
    for(var j=0;j<outcomes.length;j++){
        console.log('Number of ' + (j + 1) + ' rolled: ' + outcomes[j] + ' (' + ((outcomes[j]/trials)*100) + "%)");
    }
};
//diceTesting(20, 1000000);

var targetingTest = function(){
    var peep = getHero();
    var deadGobo = getGobo();
    deadGobo.hitpoints = 0;

    var deadGobo2 = getGobo();
    deadGobo2.hitpoints = 0;

    var combatants = [peep, deadGobo, getGobo(), deadGobo2];
    var summaries = combatants.map(function(item, i){ return item.name; });
    console.log('Combatants: ' + summaries.join(', '));
    console.log('Attacker: ' + peep.name);

    var target = chooseTarget(peep, combatants);
    console.log('Chosen target: ' + target.name);
}
//targetingTest();

var attackTest = function(){
    attack(getGobo(), getGobo());
}
//attackTest();

var initiativeTest = function(){
    var peep = getHero();
    peep.initiativeRoll = 10;
    
    var gobo = getGobo();
    gobo.initiativeRoll = 5;
    
    var combatants = [peep, gobo];
    console.log('Current order: ' + combatants.map(function(item){ return item.name;}).join(', '));

    var sorted = combatants.sort(sortByInitiative);
    console.log('Sort order: ' + sorted.map(function(item){ return item.name;}).join(', '));
}
//initiativeTest();

var roundTest = function(){
    
    var combatants = [getHero(10),
        getGobo(5), getGobo(1), getGobo(3), getGobo(15)];

    round(combatants);
}
//roundTest();