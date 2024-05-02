// import { stub } from "jest-auto-stub";
// import { EventPublishers, GameData } from "sc-number-game-base";
// import RunningRoundInfoPublisher from "../../../src/event-publishers/running-round-info-publisher";

// describe("running-round-info-publisher test", () => {
//     let publisher: RunningRoundInfoPublisher;
//     const gameData = stub<GameData>();

//     beforeEach(() => {
//         publisher = new RunningRoundInfoPublisher("CoinToss", gameData);
//         jest.spyOn(EventPublishers.RunningRoundInfoPublisher.prototype, "getBetPercentageAndPlayerBetCount").mockReturnValue({
//             betPercentage: { over: 37.5, under: 37.5, odd: 12.5, even: 12.5 },
//             playerBetCount: { over: 3, under: 3, odd: 1, even: 1 },
//         });
//     });

//     it("inherit RunningRoundInfoPublisher of sc-number-game-base", () => {
//         expect(publisher instanceof EventPublishers.RunningRoundInfoPublisher);
//     });

//     describe("getBetPercentageAndPlayerBetCount", () => {
//         it("should call super.getBetPercentageAndPlayerBetCount", () => {
//             // act
//             publisher.getBetPercentageAndPlayerBetCount();

//             // assert
//             expect(EventPublishers.RunningRoundInfoPublisher.prototype.getBetPercentageAndPlayerBetCount).toHaveBeenCalled();
//         });

//         it("should return correct", () => {
//             // act
//             const actual = publisher.getBetPercentageAndPlayerBetCount();

//             // assert
//             expect(actual).toStrictEqual({
//                 betPercentage: { over: 37, under: 37, odd: 12, even: 14 },
//                 playerBetCount: { over: 3, under: 3, odd: 1, even: 1 },
//             });
//         });
//     });
// });
