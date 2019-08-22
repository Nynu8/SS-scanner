const Cap = require('cap').Cap;
const decoders = require('cap').decoders;
const PROTOCOL = decoders.PROTOCOL;
const chalk = require('chalk');

const SolarSystem = require('./SolarSystem');
const scanParser = require('./scanParser').parseScan;

const eventChatPrefix = '\x10\x00';

let solarSystem = null;
let solarbody = null;
let systemName;

module.exports.sniff = (device) => {
  console.log(chalk.bgBlue.greenBright('-----Starting the sniffer-----'));
  let capturer = new Cap();
  let filter = 'host 167.114.156.211';
  let bufSize = 10 * 1024 * 1024;
  let buffer = Buffer.alloc(65535);

  try {
    let linkType = capturer.open(Cap.findDevice(device), filter, bufSize, buffer);
    capturer.on('packet', async (nbytes, trunc) => {
      //console.log('packet: length ' + nbytes + ' bytes, truncated? '
      //  + (trunc ? 'yes' : 'no'));
      // raw packet data === buffer.slice(0, nbytes)

      if (linkType === 'ETHERNET') {
        var ret = decoders.Ethernet(buffer);
        if (ret.info.type === PROTOCOL.ETHERNET.IPV4) {
          ret = decoders.IPV4(buffer, ret.offset);
          if (ret.info.protocol === PROTOCOL.IP.TCP) {
            var datalen = ret.info.totallen - ret.hdrlen;
            ret = decoders.TCP(buffer, ret.offset);
            datalen -= ret.hdrlen;
            let data = buffer.toString('binary', ret.offset, ret.offset + datalen);

            if (data.includes(`${eventChatPrefix}Entering`)) {
              let msg = getFullString(data, data.indexOf('Entering'));
              if (solarSystem !== null) {
                if (solarSystem.numberOfBodies() > 0) {
                  if(await SolarSystem.alreadyScanned(systemName)) {
                    if(solarSystem.numberOfBodies() < await SolarSystem.amountScanned(systemName)) {
                      console.log(chalk`{blue Number of bodies scanned is {cyan.underline smaller} than already saved: {red Overwrite cancelled}}`);
                    } else {
                      console.log(chalk`{blue Number of bodies scanned is {cyan.underline bigger or equal} to already saved: {green Overwriting}}`);
                      await solarSystem.saveToFile();
                    }
                  } else {
                    await solarSystem.saveToFile();
                  }
                } else {
                  console.log(chalk`{blue Nothing scanned, skipping {yellowBright.bold ${systemName}}}`);
                }
              }

              systemName = msg.split('Entering galaxy ')[1];
              console.log(chalk`{blue Beginning the scan of: {bold.yellowBright ${systemName}}}`);
              if(await SolarSystem.alreadyScanned(systemName)) {
                console.log(chalk`{blue {yellowBright ${systemName}} was already scanned and contains {yellowBright ${await SolarSystem.amountScanned(systemName)}} entries}`);
              }

              solarSystem = new SolarSystem(systemName);
            }

            if (data.includes(`${eventChatPrefix}Scan:`) && !data.includes(`No base slots for extraction`)) {
              let msg = getFullString(data, data.indexOf('Scan:'));
              if (solarSystem === null) {
                console.log(chalk.red('I don\'t know where you are! Please warp to a galaxy to start scanning'));
              }
              else {
                solarbody = scanParser(msg);
                if (solarSystem.alreadyScanned(solarbody.name)) {
                  console.log(chalk`{yellowBright.bold ${solarbody.name}} {blue was already scanned}`)
                } else {
                  solarSystem.addSolarbody(solarbody);
                  solarSystem.addRawSolarbody(msg);
                  console.log(chalk`{yellowBright.bold ${solarbody.name}} {blue was added to the list}`)
                }
              }
            }
          }
        }
      }
    });
  }
  catch (e) {
    console.log(chalk.bgRed.yellowBright.bold('Failed to open your network interface. Please delete your config.json file and restart the program!'));
  }
}

module.exports.findCorrectInterface = async () => {
  let interfaceList = Cap.deviceList();
  let interfaceCount = interfaceList.length;
  console.log(chalk.bgBlue.greenBright('-----Looking for correct network adapter-----'));
  for (let i = 0; i < interfaceCount; i++) {
    for(let j = 0; j < interfaceList[i].addresses.length; j++) {
      let interfaceTested = Cap.deviceList()[i].addresses[j].addr;
      console.log(chalk`{cyan Testing address {yellowBright.bold ${j}} on interface {yellowBright.bold ${i}}}`);
      let result = await testInterface(interfaceTested);
      if (result) {
        console.log(chalk.green('Correct address'));
        return interfaceTested;
      } else {
        console.log(chalk.red('Wrong address'));
      }
    }
  }

  return false;
}

async function testInterface(interface) {
  const sleep = require('util').promisify(setTimeout);
  let capturer = new Cap();
  //host 167.114.156.211
  let filter = '';
  let bufSize = 10 * 1024 * 1024;
  let buffer = Buffer.alloc(65535);

  let found = false;

  try {
    linkType = capturer.open(Cap.findDevice(interface), filter, bufSize, buffer);
    capturer.on('packet', () => {
      found = true;
    });
  }
  catch (e) {
    console.log(chalk.red('Failed to open the interface'));
    return false;
  }

  await sleep(1000);
  capturer.close();
  return found;
}

function getFullString(data, index) {
  let end = index;
  while (data[end].charCodeAt(0) >= 32 && data[end].charCodeAt(0) <= 126) {
    end++;
  }

  return data.substr(index, end - index);
}