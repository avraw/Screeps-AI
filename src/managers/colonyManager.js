const roleHarvester = require('../roles/harvester');
const roleUpgrader = require('../roles/upgrader');
const roleBuilder = require('../roles/builder');

const colonyManager = {
    roles: {
        harvester: roleHarvester,
        upgrader: roleUpgrader,
        builder: roleBuilder
    },
    
    getDesiredCounts: function(room) {
        const sources = room.find(FIND_SOURCES).length;
        const constructionSites = room.find(FIND_CONSTRUCTION_SITES).length;
        
        return {
            harvester: Math.min(sources * 2, 4),
            upgrader: 2,
            builder: constructionSites > 0 ? 2 : 1
        };
    },
    
    spawnCreep: function(spawn, role) {
        const energyAvailable = spawn.room.energyAvailable;
        const body = this.roles[role].getBody(energyAvailable);
        const newName = role.charAt(0).toUpperCase() + role.slice(1) + Game.time;
        
        return spawn.spawnCreep(body, newName, {
            memory: {role: role}
        });
    }
};

module.exports = colonyManager;
