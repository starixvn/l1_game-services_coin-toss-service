import ProcessBetQueueBase from "sc-game-base/src/core/crons/process-bet-queue";
import GameData from "../game-data";

export default class ProcessBetQueue extends ProcessBetQueueBase {
    adjustTotalBets(player: any, bet: any, rate: any) {
        super.adjustTotalBets(player, bet, rate);
        const playerInGame = this.gameData.ingame[player.profile.name];
        const { betChoice } = bet;
        (this.gameData as GameData).betCount[betChoice] += playerInGame?.ownBets?.[betChoice] ? 0 : 1;
    }
}
