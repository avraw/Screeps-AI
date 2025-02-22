const utils = require('../utils');

const roleBuilder = {
    getBody: function(energyAvailable) {
        if (energyAvailable >= 500) return [WORK,WORK,CARRY,CARRY,MOVE,MOVE];
        return [WORK,CARRY,MOVE];
    },
    
    run: function(creep) {
        if(creep.memory.building && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.building = false;
            creep.say('🔄 harvest');
        }
        if(!creep.memory.building && creep.store.getFreeCapacity() == 0) {
            creep.memory.building = true;
            creep.say('🚧 build');
        }

        if(creep.memory.building) {
            // First repair damaged structures
            const damagedStructures = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => structure.hits < structure.hitsMax
            });
            
            if(damagedStructures.length) {
                const target = creep.pos.findClosestByPath(damagedStructures);
                if(creep.repair(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                }
                return;
            }
            
            // Then handle construction sites
            const targets = creep.room.find(FIND_CONSTRUCTION_SITES);
            if(targets.length) {
                const target = creep.pos.findClosestByPath(targets);
                if(creep.build(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
        }
        else {
            const source = utils.getBestSource(creep);
            if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }
    }
};

module.exports = roleBuilder;
