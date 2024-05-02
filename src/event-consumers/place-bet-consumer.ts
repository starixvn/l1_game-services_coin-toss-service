 
// import { DrawResult } from "../models/rounds";
// import { calculateOddsRange, roundBetPercentage } from "../helpers";

import { helpers } from "sc-common";
import { PlaceBetConsumer as PlaceBetConsumerBase } from "sc-game-base/src/core/event-consumers";

export default class PlaceBetConsumer extends PlaceBetConsumerBase {
    composeBettingTimeValidationCriteria(roundId: number): { failure: boolean; notice: any; }[] {
        const configs = this.gameData.gameConfigs;
        return [
            {
                failure: !configs.enabled,
                notice: this.getNoticeObj(helpers.noticeHelper.invalidBet),
            },
            {
                failure: roundId !== this.gameData.roundId,
                notice: this.getNoticeObj(helpers.noticeHelper.invalidBet, { gameRoundId: roundId }),
            },
            {
                failure:
                    this.gameData.remainingTime < this.definition.durations.lockingBet ||
                    this.gameData.remainingTime >= this.definition.durations.placingBets,
                notice: this.getNoticeObj(helpers.noticeHelper.placeBetNextRound),
            },
        ];

    }
}
