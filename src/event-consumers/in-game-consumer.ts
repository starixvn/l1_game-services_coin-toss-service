import { TableInGameConsumer } from "sc-game-base/src/table/event-consumers";
import GameData from "../game-data";
import { calculateUserBetPercentage, roundUserBetPercentage } from "../helpers";

export default class InGameConsumer extends TableInGameConsumer {
    async buildPayload(realPlayer: any) {
        const payload = await super.buildPayload(realPlayer);
        const { playerBetCount } = this.gameData as GameData;
        const userBetPercentage = this.getUserBetPercentage(playerBetCount);
        return { ...payload, ...userBetPercentage };
    }

    getUserBetPercentage(playerBetCount: Record<string, string[]>) {
        return roundUserBetPercentage(calculateUserBetPercentage(playerBetCount));
    }
}
