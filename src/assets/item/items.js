import Repository from "../repository";
import Colors from "../colors";
import Item from "./item";

export const ItemRepository = new Repository({ name: "Items", ctor: Item });

ItemRepository.define({
  name: "healing potion",
  id: 63,
  tileset: 'items',
  fg: Colors.red
});

ItemRepository.define({
  name: "food",
  id: 53,
  tileset: 'items',
  fg: Colors.orange
});

ItemRepository.define({
  name: "mana potion",
  id: 60,
  tileset: 'items',
  fg: Colors.blue
});
// ItemRepository.define({
//   name: "Space Ship",
//   char: "§",
//   fg: Colors.blue,
//   canPickUp: false,
//   disableRandomCreation: true
// });

export const WeaponRepository = new Repository({ name: "Weapons", ctor: Item });

WeaponRepository.define({
  name: "really really big knife",
  char: "(",
  fg: Colors.blue
});
