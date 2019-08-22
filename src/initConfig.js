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
  try {
    let settings = await fs.readFile('./config.json');
    return JSON.parse(settings);
  }
  catch (e) {
    console.log(chalk.blue('Settings file was not found or could not be open, generating new settings file'));
  }
}

module.exports = async function configurateSettings() {
  let settings = await readConfigFile();
  let url;
  let networkInterface;
  if (settings !== undefined) {
    url = settings.sheetUrl;
    networkInterface = settings.networkInterface;
    console.log(chalk`{blue Your last Google Spreadsheet URL was:} {bold.yellowBright ${url}}`);
    console.log(chalk`{blue If you wish to keep using that file, {cyan.underline press enter}. If you wish to change it, {cyan.underline paste full, valid URL} to the Google Spreadsheet.}`);
    let input = await promisify(readline.question)(chalk.cyan('Sheet url: '));
    readline.close();
    if (input.length > 0) {
      url = input;
      try {
        fs.writeFile('./config.json', JSON.stringify({ sheetUrl: url, networkInterface: settings.networkInterface }));
      }
      catch (e) {
        console.log(chalk.red('Failed to save your config file'));
      }
    } else {
      console.log(chalk.green('Using old configuration'));
    }
  } else {
    console.log(chalk.cyan('Paste your spreadsheet URL'));
    input = await promisify(readline.question)(chalk.cyan('Sheet url: '));
    readline.close();
    url = input;
    networkInterface = await interfaceFinder();
    if(!networkInterface) {
      console.log(chalk.bgRed.yellowBright.bold('Failed to find the correct network adapter. Make sure SS is running and you\'re logged in!'));
      await promisify(readline.question)(chalk.cyan('Press enter to exit'));
      process.exit(0);
    }
    try {
      fs.writeFile('./config.json', JSON.stringify({ sheetUrl: url, networkInterface: networkInterface }));
      console.log('Configuration saved.');
    }
    catch (e) {
      console.log(chalk.red('Failed to save your config file'));
    }
  }

  return {url, networkInterface};
}