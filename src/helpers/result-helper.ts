// import { CoinToss, Utils } from "@rd/numbers-game-probabilities";
// import { OVER_FACTOR } from "../constants";
// import { DrawResult } from "../models/rounds";

import { Result } from "../models/rounds";

export type FinalSeeds = {
    serverSeed: string;
    finalHash: string;
};

export const generateResult = (finalHash: string) => {
    const result = finalHashToNumber(finalHash) % 2 == 0;
    return { head: result, tail: !result };
};

export const finalHashToNumber = (finalHash: string) => {
    const Hexadecimal = 16;
    return parseInt(finalHash.slice(0, 5), Hexadecimal);
};

export const getSettlementResult = (result: Result) => {
    return result;
};

// export const getProbabilities = (roundResult: DrawResult[]) => {
//     const balls = roundResult.map((drawResult) => +drawResult.ball);
//     return CoinToss.getProbabilities(balls);
// };

export const generateRawResultForHash = () => {};
