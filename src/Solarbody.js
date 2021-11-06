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
    baobabs,
    ruins,
    other
  ) {
    this.name = name;
    this.gravity = gravity || "";
    this.temperature = temperature || "";
    this.atmosphere = atmosphere || "";
    this.baseSlots = baseSlots;
    this.metals = metals ?? "";
    this.nukes = nukes ?? "";
    this.silicon = silicon ?? "";
    this.spaceOats = spaceOats ?? "";
    this.baobabs = baobabs ?? "";
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
      this.spaceOats,
      this.baobabs,
    ];

    //ruins
    data.push(this.ruins.join(" "));

    //other resources
    data = data.concat(this.other);

    return data;
  }
}

module.exports = SolarBody;
