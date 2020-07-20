export enum Side {
  light = "Light",
  dark = "Dark",
}

export enum Type {
  Location = "Location",
  Character = "Character",
  Effect = "Effect",
  Weapon = "Weapon",
  Creature = "Creature",
  Starship = "Starship",
  Interrupt = "Interrupt",
  JediTest2 = "Jedi Test #2",
  Objective = "Objective",
  Vehicle = "Vehicle",
  Device = "Device",
  EpicEvent = "Epic Event",
  JediTest3 = "Jedi Test #3",
  JediTest1 = "Jedi Test #1",
  GameAid = "Game Aid",
  JediTest5 = "Jedi Test #5",
  JediTest4 = "Jedi Test #4",
  JediTest6 = "Jedi Test #6",
  DefensiveShield = "Defensive Shield",
  Podracer = "Podracer",
  AdmiralsOrder = "Admiral's Order",
}

export interface Card {
  id: number;
  side: Side;
  rarity: string;
  set: string;
  front: {
    title: string;
    imageUrl: string;
    type: Type;
    subType: string;
    uniqueness: string;
    destiny: number;
    power: number;
    deploy: number;
    forfeit: number;
    gametext: string;
    lore: string;
    extraText: string[];
  };
  pulledBy: string[];
  legacy: boolean;
}
