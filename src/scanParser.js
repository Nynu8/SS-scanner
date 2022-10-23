const Solarbody = require("./Solarbody");

module.exports.parseScan = function (scanString) {
  let name = scanString.match("\\[(.*?)(?: \\(.*\\))?\\]")[1];

  let gravity = scanString.match("(Low|Normal|Heavy) Gravity");
  if (gravity !== null) gravity = gravity[1];

  let temperature = scanString.match("(Frozen|Temperate|Blistering),");
  if (temperature !== null) temperature = temperature[1];

  let atmosphere = scanString.match("(Noxious|Gaseous|Terran)");
  if (atmosphere !== null) atmosphere = atmosphere[1];

  let baseSlots = scanString.match(/Base Slots: (\d)/)[1];

  let metals = scanString.match(/(?:.* of Metals* \((\d+)\))/);
  if (metals !== null) metals = metals[1];

  let nukes = scanString.match(/(?:.* of Nuclear Waste* \((\d+)\))/);
  if (nukes !== null) nukes = nukes[1];

  let silicon = scanString.match(/(?:.* of Silicon* \((\d+)\))/);
  if (silicon !== null) silicon = silicon[1];

  let spaceOats = scanString.match(/(?:.* of Space Oats* \((\d+)\))/);
  if (spaceOats !== null) spaceOats = spaceOats[1];

  let baobabs = scanString.match(/(?:.* of Baobabs* \((\d+)\))/);
  if (baobabs !== null) baobabs = baobabs[1];

  let ruins = [];
  let regexp = /(?:Ruins of )(.*?)(?:,|$|\.)/g;
  while ((match = regexp.exec(scanString))) {
    ruins.push(match[1]);
  }

  let commods = [];
  regexp =
    /(?:A )?(?:smidgin|little|A bit|bunch|lot|Plenty|Loads) (?:of )?((?!Metals|Nuclear Waste|Silicon|Space Oats|Baobabs|of)(?:.*?))(?:,|$|\.)/g;
  while ((match = regexp.exec(scanString))) {
    commods.push(match[1]);
  }

  return new Solarbody(
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
    commods
  );
};
