export enum Side {
  light = "Light",
  dark = "Dark",
}

export interface Card {
  id: number;
  side: Side;
  rarity: string;
  set: string;
  front: {
    title: string;
    imageUrl: string;
    type: string;
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
