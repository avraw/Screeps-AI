const { ScreepsAPI } = require('@screeps/common');
const fs = require('fs');

const token = '8a51270c-6df1-458a-bf03-b4044b0a080e'; // From .screepsrc

async function upload() {
    try {
        const api = new ScreepsAPI({
            token,
            protocol: 'https',
            hostname: 'screeps.com',
            port: 443
        });

        const code = fs.readFileSync('./dist/main.js', 'utf8');
        await api.setCode('simulation', { main: code });
        console.log('Code uploaded to simulation branch successfully');
    } catch (err) {
        console.error('Upload failed:', err);
    }
}

upload().catch(console.error);
