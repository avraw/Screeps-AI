const utils = {
    getEnergySources: function(room) {
        return room.find(FIND_SOURCES);
    },
    
    getBestSource: function(creep) {
        const sources = creep.room.find(FIND_SOURCES);
        return sources.reduce((best, source) => {
            const workingHere = _.filter(Game.creeps, c => 
                c.memory.sourceId === source.id && 
                c.memory.role === creep.memory.role
            ).length;
            
            if (!best || workingHere < best.workingHere) {
                return { source, workingHere };
            }
            return best;
        }, null)?.source || sources[0];
    }
};

module.exports = utils;
