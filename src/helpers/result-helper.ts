// import { CoinToss, Utils } from "@rd/numbers-game-probabilities";
// import { OVER_FACTOR } from "../constants";
// import { DrawResult } from "../models/rounds";

import { Result } from "../models/rounds";

export type FinalSeeds = {
    serverSeed: string;
    finalHash: string;
};

export const generateResult = (finalSeeds: FinalSeeds) => {
    const serverSeed = JSON.parse(finalSeeds.serverSeed);

    // const balls = serverSeed.remain.split(":").map((x: string) => +x);

    // const random = +serverSeed.random;

    // const increment = finalHashToNumber(finalSeeds.finalHash);

    // const totalRemainingBalls = balls.length;

    // const index = (random + increment) % totalRemainingBalls;

    const result = Math.floor(Math.random() * 10001) % 2 == 0;
    return { head: result, tail: !result };
};

// export const finalHashToNumber = (finalHash: string) => {
//     return parseInt(finalHash.slice(0, 2), 16);
// };

export const getSettlementResult = (result: Result) => {
    return result;
};

// export const getProbabilities = (roundResult: DrawResult[]) => {
//     const balls = roundResult.map((drawResult) => +drawResult.ball);
//     return CoinToss.getProbabilities(balls);
// };

export const generateRawResultForHash = () => {};
