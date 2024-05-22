import { TableGameData as GameDataBase } from "sc-game-base/src/table";

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
