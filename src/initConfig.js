const fs = require('fs').promises;
const { promisify } = require('util');
const interfaceFinder = require('./sniffer').findCorrectInterface;
const chalk = require('chalk');

const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
})

readline.question[promisify.custom] = (question) => {
  return new Promise((resolve) => {
    readline.question(question, resolve);
  });
};

async function readConfigFile() {
  console.log(chalk.blue('Trying to load configuration file'));
  try {
    let settings = await fs.readFile('./snifferConfig.json');
    return JSON.parse(settings);
  }
  catch (e) {
    console.log(chalk.red('Configuration file was not found or could not be open'));
  }
}

module.exports = async function configurateSettings() {
  let settings = await readConfigFile();
  let networkInterface;
  if (settings !== undefined) {
    console.log(chalk.green('Success'));
    networkInterface = settings.networkInterface;
  } else {
    console.log(chalk.blue('Generating new settings file'));
    networkInterface = await interfaceFinder();
    settings = {};
    settings.networkInterface = networkInterface;
    if(!networkInterface) {
      console.log(chalk.bgRed.yellowBright.bold('Failed to find the correct network adapter. Make sure SS is running and you\'re logged in!'));
      await promisify(readline.question)(chalk.cyan('Press enter to exit'));
      process.exit(0);
    }
    try {
      fs.writeFile('./snifferConfig.json', JSON.stringify(settings));
      console.log(chalk.green('Configuration saved.'));
    }
    catch (e) {
      console.log(chalk.red('Failed to save your config file'));
    }
  }

  console.log(chalk`{blue Looking for {yellowBright scan} directories}`);
  try {
    await fs.mkdir('./raw_scans');
    console.log(chalk`{blue Could not find {yellowBright raw_scans} directory, creating one}`);
  } catch(e) {
    console.log(chalk`{yellowBright raw_scans} {blue directory was found}`);
  }

  try {
    await fs.mkdir('./sheet_scans');
    console.log(chalk`{blue Could not find {yellowBright sheet_scans} directory, creating one}`);
  } catch(e) {
    console.log(chalk`{yellowBright sheet_scans} {blue directory was found}`);
  }

  return networkInterface;
}