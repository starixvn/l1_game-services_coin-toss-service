// import { EventConsumers } from "sc-game-base";
// import { ServerSeedHelper } from "sc-game-base/src/core/helpers";
// import { SERVER_SEED_SECRET_LENGTH, TOTAL_BALLS } from "../constants";
// import { generateRemainingBalls, getRandomIndex } from "sc-number-game-base/dist/helpers";
// import { DrawResult } from "../models/rounds";

// export default class RoundResultConsumer extends EventConsumers.RoundResultConsumer {
//     generateServerSeed() {
//         const { randomMode } = this.gameData.gameConfigs;
//         const { roundResult } = this.gameData;
//         const totalDrawnBalls: number = roundResult.length ?? 0;
//         const totalRemainingBalls = TOTAL_BALLS - totalDrawnBalls;

//         const drawn = (roundResult as DrawResult[]).map((res) => +res.ball);

//         const random = getRandomIndex(randomMode, totalRemainingBalls);

//         const remainingBalls = generateRemainingBalls(TOTAL_BALLS, drawn).join(":");

//         const serverSeedSecret = ServerSeedHelper.generateServerSeed(randomMode, SERVER_SEED_SECRET_LENGTH);

//         return `{"random":"${random}","remain":"${remainingBalls}","secret":"${serverSeedSecret}"}`;
//     }
// }
