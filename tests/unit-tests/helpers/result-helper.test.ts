// import { CoinToss } from "@rd/numbers-game-probabilities";
// import { ServerSeedHelper } from "sc-game-base/src/core/helpers";
// import * as resultHelper from "../../../src/helpers/result-helper";
// import { Result } from "../../../src/models/rounds";

// jest.mock("sc-game-base/src/core/helpers", () => ({
//     ServerSeedHelper: { generateServerSeed: jest.fn().mockReturnValue("123asd") },
// }));

// jest.mock("@rd/numbers-game-probabilities", () => ({
//     ...jest.requireActual("@rd/numbers-game-probabilities"),
//     CoinToss: { getProbabilities: jest.fn() },
// }));

// describe("result helper tests", () => {
//     describe("finalHashToNumber", () => {
//         it("should return expected", () => {
//             // arrange
//             const finalHash = "0f0f0f";

//             // act
//             const actual = resultHelper.finalHashToNumber(finalHash);

//             // assert
//             expect(actual).toEqual(15);
//         });
//     });

//     describe("generateResult", () => {
//         it("should return expected", () => {
//             // arrange
//             const random = 10;

//             const remainingBalls = [...Array(75 + 1).keys()].slice(1).join(":");

//             const serverSeedSecret = ServerSeedHelper.generateServerSeed(1, 32);

//             const serverSeed = `{"random":"${random}","remain":"${remainingBalls}","secret":"${serverSeedSecret}"}`;

//             const finalSeeds = {
//                 serverSeed: serverSeed,
//                 finalHash: "0f0f0f",
//             };

//             // act
//             const actual = resultHelper.generateResult(finalSeeds);

//             // assert
//             expect(actual).toEqual({ ball: 26 });
//         });
//     });

//     describe("getSettlementResult", () => {
//         it("should return expected", () => {
//             // arrange
//             const result = {
//                 ball: 1,
//             } as Result;

//             // act
//             const actual = resultHelper.getSettlementResult(result);

//             // assert
//             expect(actual).toEqual({
//                 over: false,
//                 under: true,
//                 odd: true,
//                 even: false,
//             });
//         });
//     });

//     describe("getProbabilities", () => {
//         it("should return expected", () => {
//             // arrange
//             const roundResult = [
//                 {
//                     drawId: 1,
//                     ball: 1,
//                 },
//                 {
//                     drawId: 2,
//                     ball: 2,
//                 },
//                 {
//                     drawId: 3,
//                     ball: 3,
//                 },
//             ] as Result[];

//             // act
//             resultHelper.getProbabilities(roundResult);

//             // assert
//             expect(CoinToss.getProbabilities).toHaveBeenCalledWith([1, 2, 3]);
//         });
//     });
// });
