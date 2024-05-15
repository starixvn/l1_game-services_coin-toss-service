import BaseGameCron from "sc-game-base/src/core/crons/base-game-cron";
import GameData from "../game-data";

export default class GameCron extends BaseGameCron {
    resetForNewRound() {
        super.resetForNewRound();
        (this.gameData as GameData).betCount = {
            head: 0,
            tail: 0,
            
        };
    }
}
