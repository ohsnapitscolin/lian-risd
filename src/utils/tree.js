import chance, { randColor } from "../utils/chance";

export default function generate() {
  const color = "000000";
  return generatePerson(0, [color]);
}

function generatePerson(depth, colors) {
  if (depth >= 10) return null;

  const genderOdds = chance(50);
  const partnerOdds = chance(90);
  let children = [];
 
  // const partnerColor = depth ? randColor() : "F8F4E9" 
  const partnerColor = randColor();

  if (partnerOdds) {
    const childrenOdds = [
      chance(80),
      chance(50),
      chance(10),
      chance(5),
      chance(1),
    ].filter(Boolean)
    children = childrenOdds.map(() => {
      return generatePerson(depth + 1, colors.concat(partnerColor));
    })
  }
 
  const gender = genderOdds;
  const person = new Person({
    gender,
    children,
    colors,
    depth
  });

  const sameGenderOdds = chance(7);

  if (partnerOdds) {
    const partner = new Person({
      gender: sameGenderOdds ? gender : !gender,
      children,
      colors: [partnerColor],
      depth
    });
    partner.setPartner(person)
    person.setPartner(partner);
  }

  return person;
}

class Person {
  constructor({ gender, children, colors, depth }) {
    this.depth = depth
    this.gender = gender;
    this.children = children;
    this.colors = colors || [];
  }

  setPartner(partner) {
    this.partner = partner;
  }
}

export function flatten() {
  const person = generate();
  const flat = [];
  flattenPerson(flat, 0, person);
  return flat;
}

function flattenPerson(flat, depth, person) {
  if (!person) return;
  
  if (!flat[depth]) flat[depth] = [];

  flat[depth].push(person)

  if (person.children.length) {
    person.children.forEach(c => {
      flattenPerson(flat, depth + 1, c)
    })
  }
}


