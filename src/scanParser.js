const Solarbody = require("./Solarbody");

module.exports.parseScan = function (scanString) {
  let name = scanString.match("\\[(.*?)(?: \\(.*\\))?\\]")[1];

  let gravity = scanString.match("(Low|Normal|Heavy) Gravity");
  if (gravity !== null) gravity = gravity[1];

  let temperature = scanString.match("(Frozen|Temperate|Blistering),");
  if (temperature !== null) temperature = temperature[1];

  let atmosphere = scanString.match("(Noxious|Gaseous|Terran)");
  if (atmosphere !== null) atmosphere = atmosphere[1];

  let baseSlots = scanString.match("Base Slots: (\\d)")[1];

  let metals = scanString.match(
    "(?:A )?(smidgin|little|bit|bunch|lot|Plenty|Loads) (?:of )?Metals (\\(\\d+\\))"
  );
  if (metals !== null) metals = `${metals[1]} ${metals[2]}`;

  let nukes = scanString.match(
    "(?:A )?(smidgin|little|bit|bunch|lot|Plenty|Loads) (?:of )?Nuclear Waste (\\(\\d+\\))"
  );
  if (nukes !== null) nukes = `${nukes[1]} ${nukes[2]}`;

  let silicon = scanString.match(
    "(?:A )?(smidgin|little|bit|bunch|lot|Plenty|Loads) (?:of )?Silicon (\\(\\d+\\))"
  );
  if (silicon !== null) silicon = `${silicon[1]} ${silicon[2]}`;

  let spaceOats = scanString.match(
    "(?:A )?(smidgin|little|bit|bunch|lot|Plenty|Loads) (?:of )?Space Oats (\\(\\d+\\))"
  );
  if (spaceOats !== null) spaceOats = `${spaceOats[1]} ${spaceOats[2]}`;

  let ruins = [];
  let regexp = /(?:Ruins of )(.*?)(?:,|$|\.)/g;
  while ((match = regexp.exec(scanString))) {
    ruins.push(match[1]);
  }

  let commods = [];
  regexp = /((?:A )?(?:smidgin|little|A bit|bunch|lot|Plenty|Loads) (?:of )?(?!Metals|Nuclear Waste|Silicon|Space Oats|of)(?:.*?))(?:,|$|\.)/g;
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
    ruins,
    commods
  );
};
