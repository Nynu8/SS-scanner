const initConf = require('./src/initConfig');
const sniff = require('./src/sniffer').sniff;
const chalk = require('chalk');

(async () => {
  console.log(chalk`{blue Star Sonata scanner by {yellowBright.bold Nynu}}`);
  console.log(chalk`{cyan How to use:\n}1. Start the scanner\n2. Wait for settings to load and for sniffer to start\n3. Warp into a system and scan\n4. Warp to another system to save\n`);
  let networkInterface = await initConf();
  sniff(networkInterface);
})();