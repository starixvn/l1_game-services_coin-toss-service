import { GameData as GameDataBase } from "sc-game-base/src/core";

export default class GameData extends GameDataBase {
    constructor(remainingTime: number) {
        super(remainingTime);
        this.betCount = {
            head: 0,
            tail: 0,
        };
    }
    betCount: Record<string, number>;
}
