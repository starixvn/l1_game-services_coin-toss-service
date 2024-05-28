import { TableInGameConsumer } from "sc-game-base/src/table/event-consumers";
import GameData from "../game-data";
import { calculateBetPercentage, roundBetPercentage } from "../helpers";

export default class InGameConsumer extends TableInGameConsumer {
    async buildPayload(realPlayer: any) {
        const payload = await super.buildPayload(realPlayer);
        const { playerBetCount } = this.gameData as GameData;
        const betPercentage = this.getBetPercentage(playerBetCount);
        return { ...payload, ...betPercentage };
    }

    getBetPercentage(playerBetCount: Record<string, string[]>) {
        return roundBetPercentage(calculateBetPercentage(playerBetCount));
    }
}
