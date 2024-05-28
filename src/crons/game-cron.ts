import { Table } from "sc-game-base";
import GameData from "../game-data";

export default class GameCron extends Table.Crons.TableGameCron {
    resetForNewRound() {
        super.resetForNewRound();
        (this.gameData as GameData).playerBetCount = {};
    }
}
