'use strict';

require('./src/utils');
require('./src/roles/harvester');
require('./src/roles/upgrader');
require('./src/roles/builder');
const colonyManager = require('./src/managers/colonyManager');
require('./src/optimizer');

module.exports.loop = function() {
    // Clean up memory
    for(const name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }

    // Colony management for each spawn
    for(const spawnName in Game.spawns) {
        const spawn = Game.spawns[spawnName];
        const room = spawn.room;
        
        // Count current creeps
        const counts = {};
        for(const role in colonyManager.roles) {
            counts[role] = _.filter(Game.creeps, creep => 
                creep.memory.role == role &&
                creep.room.name == room.name
            ).length;
        }
        
        // Get desired counts
        const desired = colonyManager.getDesiredCounts(room);
        
        // Spawn missing creeps
        for(const role in desired) {
            if(counts[role] < desired[role] && !spawn.spawning) {
                colonyManager.spawnCreep(spawn, role);
                break;
            }
        }

        // Visual spawn notification
        if(spawn.spawning) { 
            const spawningCreep = Game.creeps[spawn.spawning.name];
            spawn.room.visual.text(
                '🛠️' + spawningCreep.memory.role,
                spawn.pos.x + 1, 
                spawn.pos.y, 
                {align: 'left', opacity: 0.8});
        }
    }

    // Run creep roles
    for(const name in Game.creeps) {
        const creep = Game.creeps[name];
        if(colonyManager.roles[creep.memory.role]) {
            colonyManager.roles[creep.memory.role].run(creep);
        }
    }

    // Display status every 5 ticks
    if(Game.time % 5 === 0) {
        for(const spawnName in Game.spawns) {
            const room = Game.spawns[spawnName].room;
            const counts = {};
            for(const role in colonyManager.roles) {
                counts[role] = _.filter(Game.creeps, creep => 
                    creep.memory.role == role &&
                    creep.room.name == room.name
                ).length;
            }
            
            console.log(`==== Status Report: ${room.name} ====`);
            for(const role in counts) {
                console.log(`${role}: ${counts[role]}`);
            }
            console.log(`Energy: ${room.energyAvailable}/${room.energyCapacityAvailable}`);
            console.log('====================');
        }
    }
};
