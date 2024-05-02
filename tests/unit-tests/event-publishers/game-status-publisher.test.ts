// import { stub } from "jest-auto-stub";
// import { GameData } from "sc-number-game-base";
// import { GameStatusPublisher } from "../../../src/event-publishers";
// import * as Helpers from "../../../src/helpers";

// describe("running-round-info-publisher test", () => {
//     let publisher: GameStatusPublisher;
//     const gameData = stub<GameData>();

//     beforeEach(() => {
//         publisher = new GameStatusPublisher("CoinToss", gameData);
//     });

//     describe("getOddsRange", () => {
//         jest.spyOn(Helpers, "calculateOddsRange").mockReturnValue({
//             min: { over: 2, under: 2, odd: 2, even: 2 },
//             max: { over: 2, under: 2, odd: 2, even: 2 },
//         });

//         it("should return correct", () => {
//             // act
//             const actual = publisher.getOddsRange();

//             // assert
//             expect(actual).toStrictEqual({
//                 min: { over: 2, under: 2, odd: 2, even: 2 },
//                 max: { over: 2, under: 2, odd: 2, even: 2 },
//             });
//         });
//     });
// });
