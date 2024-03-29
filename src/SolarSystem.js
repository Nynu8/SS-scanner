const fs = require("fs").promises;
const chalk = require("chalk");
const F_OK = require("fs").constants.F_OK;

class SolarSystem {
  constructor(name) {
    this.name = name;
    this.solarbodies = [];
    this.rawSolarbodies = [];
  }

  addSolarbody(solarbody) {
    this.solarbodies.push(solarbody);
  }

  addRawSolarbody(string) {
    this.rawSolarbodies.push(string);
  }

  numberOfBodies() {
    return this.solarbodies.length;
  }

  alreadyScanned(solarbodyName) {
    for (const solarbody in this.solarbodies) {
      if (solarbodyName === this.solarbodies[solarbody].name) {
        return true;
      }
    }

    return false;
  }

  getSheetData() {
    let num = 2;
    let data = [
      [
        "Planet Name",
        "Reserved",
        "Gravity",
        "Temperature",
        "Atmosphere",
        "",
        "",
        "",
        "",
        "Suit",
        "Terra Mod",
        "CA LV",
        "Adjusted Suit",
        "Slots",
        '="Metal ("&SUMPRODUCT($N$2:$N;O2:O)&")"',
        '="Nuke ("&SUMPRODUCT($N$2:$N;P2:P)&")"',
        '="Silic ("&SUMPRODUCT($N$2:$N;Q2:Q)&")"',
        '="Oats ("&SUMPRODUCT($N$2:$N;R2:R)&")"',
        '="Baobs ("&SUMPRODUCT($N$2:$N;S2:S)&")"',
        "Ruins ",
        "Other",
      ],
    ];

    this.solarbodies.forEach((body) => {
      let tmp = body.getSheetArray();
      tmp[5] = `=IF(C${num}="Heavy";0.5;IF(C${num}="Low";0.75;1))`;
      tmp[6] = `=IF(D${num}="Blistering";0.5;IF(D${num}="Frozen";0.75;1))`;
      tmp[7] = `=IF(E${num}="Gaseous";0.5;IF(E${num}="Noxious";0.75;1))`;
      tmp[8] = `=IF(L${num}="";0;VLOOKUP(L${num};CAs!$A$2:$B$1101;2;FALSE))`;
      tmp[9] = `=IF(C${num}="";"";ROUNDDOWN(F${num}*G${num}*H${num}*100))`;
      tmp[12] = `=IF(C${num}="";"";IF((F${num}*G${num}*H${num}*100)*(1+I${num}*0.05)+K${num}>125;125;ROUNDDOWN((F${num}*G${num}*H${num}*100)*(1+I${num}*0.05)+K${num})))`;
      data.push(tmp);
      num++;
    });

    return data;
  }

  async saveToFile() {
    let data = this.getSheetData();
    let dataToSave = data.join("\n");
    let rawDataToSave = this.rawSolarbodies.join("\n");
    try {
      await fs.writeFile(`./sheet_scans/${this.name}.txt`, dataToSave);
      await fs.writeFile(`./raw_scans/${this.name}.txt`, rawDataToSave);
      console.log(chalk`{green Saved {yellowBright ${this.name}} to the file}`);
    } catch (e) {
      console.log(chalk.red("Failed to save the scan file"));
      console.log(chalk.red(e.message));
    }
  }

  static async alreadyScanned(name) {
    try {
      await fs.access(`./sheet_scans/${name}.txt`, F_OK);
      return true;
    } catch (e) {
      return false;
    }
  }

  static async amountScanned(name) {
    try {
      let data = await fs.readFile(`./sheet_scans/${name}.txt`, "utf-8");
      let i = 0;
      data.split(/\r?\n/).forEach(() => {
        i++;
      });

      return i - 1;
    } catch (e) {
      return 0;
    }
  }
}

module.exports = SolarSystem;
