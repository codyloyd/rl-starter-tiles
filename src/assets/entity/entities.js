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
  id: 4212,
  tileset: 'tileset',
  fg: Colors.white,
  mixins: [Movable, PlayerActor, InventoryHolder]
};

export const MonsterTemplate = {
  name: "Monster",
  char: "m",
  id: 3880,
  tileset: 'tileset',
  fg: Colors.green,
  mixins: [Movable, MonsterActor]
};

export const RatTemplate = {
  name: "Monster",
  char: "m",
  id: 3880,
  tileset: 'tileset',
  fg: Colors.brown,
  mixins: [Movable, MonsterActor]
};

export const GoblinTemplate = {
  name: "Monster",
  char: "m",
  id: 2936,
  tileset: 'tileset',
  fg: Colors.indigo,
  mixins: [Movable, MonsterActor]
};