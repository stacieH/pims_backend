const dns = require ('dns');

const setDns = () => {
    dns.setServers([
        '8.8.8.8',
        '8.8.4.4'
    ]);
}

module.exports = {
 setDns
}