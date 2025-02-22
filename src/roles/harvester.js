const utils = require('../utils');

const roleHarvester = {
    getBody: function(energyAvailable) {
        if (energyAvailable >= 550) return [WORK,WORK,WORK,CARRY,CARRY,MOVE,MOVE];
        if (energyAvailable >= 400) return [WORK,WORK,CARRY,CARRY,MOVE,MOVE];
        return [WORK,CARRY,MOVE];
    },
    
    run: function(creep) {
        if (!creep.memory.sourceId) {
            const source = utils.getBestSource(creep);
            creep.memory.sourceId = source.id;
        }

        if(creep.store.getFreeCapacity() > 0) {
            const source = Game.getObjectById(creep.memory.sourceId);
            if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }
        else {
            const targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_EXTENSION ||
                            structure.structureType == STRUCTURE_SPAWN ||
                            structure.structureType == STRUCTURE_TOWER) &&
                            structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                }
            });
            
            if(targets.length > 0) {
                // Sort by distance to optimize movement
                const target = creep.pos.findClosestByPath(targets);
                if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
        }
    }
};

module.exports = roleHarvester;
