class SolarBody {
  constructor(
    name,
    gravity,
    temperature,
    atmosphere,
    baseSlots,
    metals,
    nukes,
    silicon,
    spaceOats,
    ruins,
    other
  ) {
    this.name = name;
    this.gravity = gravity || "";
    this.temperature = temperature || "";
    this.atmosphere = atmosphere || "";
    this.baseSlots = baseSlots;
    metals !== null
      ? (this.metals = capitalizeFirstLetter(metals))
      : (this.metals = "");
    nukes !== null
      ? (this.nukes = capitalizeFirstLetter(nukes))
      : (this.nukes = "");
    silicon !== null
      ? (this.silicon = capitalizeFirstLetter(silicon))
      : (this.silicon = "");
    spaceOats !== null
      ? (this.spaceOats = capitalizeFirstLetter(spaceOats))
      : (this.spaceOats = "");
    this.ruins = ruins;
    this.other = other;
  }

  getSheetArray() {
    let data = [
      this.name,
      "",
      this.gravity,
      this.temperature,
      this.atmosphere,
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      this.baseSlots,
      this.metals,
      this.nukes,
      this.silicon,
      this.spaceOats
    ];
    let ruins = "";
    this.ruins.forEach(ruin => {
      ruins += ruin + " ";
    });

    data.push(ruins);

    this.other.forEach(resource => {
      data.push(resource);
    });

    return data;
  }
}

module.exports = SolarBody;

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
