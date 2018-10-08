import Colors from "../colors";
import {
  InventoryHolder,
  PlayerActor,
  MonsterActor,
  Movable
} from "./entityMixins";

export const PlayerTemplate = {
  name: "ME",
  char: "@",
  id: 1,
  tileset: 'avatar',
  fg: Colors.white,
  mixins: [Movable, PlayerActor, InventoryHolder]
};

export const MonsterTemplate = {
  name: "Monster",
  char: "m",
  id: 278,
  tileset: 'monsters',
  fg: Colors.green,
  mixins: [Movable, MonsterActor]
};

export const RatTemplate = {
  name: "Monster",
  char: "m",
  id: 77,
  tileset: 'monsters',
  fg: Colors.brown,
  mixins: [Movable, MonsterActor]
};

export const GoblinTemplate = {
  name: "Monster",
  char: "m",
  id: 163,
  tileset: 'monsters',
  fg: Colors.indigo,
  mixins: [Movable, MonsterActor]
};
