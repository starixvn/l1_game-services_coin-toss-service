// import { EventConsumers, GameData } from "sc-game-base-type";
// import { DrawResult } from "../models/rounds";
// import { calculateOddsRange, roundBetPercentage } from "../helpers";

// export default class InGameConsumer extends EventConsumers.InGameConsumer {
//     getOddsRange(margin?: Record<string, number>[]) {
//         return calculateOddsRange(margin);
//     }

//     getBetPercentage(playerBetCount: Record<string, string[]>) {
//         const betPercentage = super.getBetPercentage(playerBetCount);

//         roundBetPercentage(betPercentage);

//         return betPercentage;
//     }

//     getCurrentRoundData() {
//         const payload = super.getCurrentRoundData();
//         const { roundResult }: { roundResult: DrawResult[] } = this.gameData as GameData;
//         const balls = roundResult.map((result) => +result.ball);

//         return { ...payload, balls };
//     }
// }
