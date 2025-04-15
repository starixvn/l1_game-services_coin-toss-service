import { TableGameData as GameDataBase } from "sc-game-base/src/table";

export default class GameData extends GameDataBase {
    constructor(remainingTime: number) {
        super(remainingTime);
        this.playerBetCount = {};
        this.viewPlayers = {};
    }
    playerBetCount: Record<string, string[]> = {};
    viewPlayers: Record<string, any> = {};
}
