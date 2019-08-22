const initConf = require('./src/initConfig');
const sniff = require('./src/sniffer').sniff;

(async () => {
  let settings = await initConf();
  sniff(settings.networkInterface);
})();