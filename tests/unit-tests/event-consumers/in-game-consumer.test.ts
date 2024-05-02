// import {  GameData, GameDefinition } from "sc-game-base/src/core";
// import { stub } from "jest-auto-stub";
// import * as Helpers from "../../../src/helpers";
// import { InGameConsumer } from "sc-game-base/src/core/event-consumers";
// import { Core } from "sc-game-base";
// import GameManagementApiClientFactory from "sc-game-base/src/core/game-management-api";

// describe("InGameConsumer test", () => {
//     let consumer: InGameConsumer;
//     const definition = stub<GameDefinition>();
//     const gameData = stub<GameData>();
//     const roundQuery = stub<Core.QueryApis.RoundQuery>();
//     const publisher = stub<Core.BaseEventPublishers.BaseEventPublisher>();
//     const getBalance = jest.fn();
//     const gameManagementApiClientFactory = stub<GameManagementApiClientFactory>();

//     beforeEach(() => {
//         consumer = new InGameConsumer(definition, gameData, roundQuery, publisher, getBalance, gameManagementApiClientFactory);
//     });

//     it("inherit InGameConsumer of sc-number-game-base", () => {
//         expect(consumer instanceof EventConsumers.InGameConsumer);
//     });

//     describe("getOddsRange", () => {
//         jest.spyOn(Helpers, "calculateOddsRange").mockReturnValue({
//             min: { over: 2, under: 2, odd: 2, even: 2 },
//             max: { over: 2, under: 2, odd: 2, even: 2 },
//         });

//         it("should return correct", () => {
//             // Arrange
//             const expectedOddsRange = {
//                 min: { over: 2, under: 2, odd: 2, even: 2 },
//                 max: { over: 2, under: 2, odd: 2, even: 2 },
//             };
//             // Act
//             const actual = consumer.getOddsRange();

//             // Assert
//             expect(actual).toEqual(expectedOddsRange);
//         });
//     });

//     describe("getBetPercentage", () => {
//         jest.spyOn(EventConsumers.InGameConsumer.prototype, "getBetPercentage").mockReturnValue({
//             over: 37.5,
//             under: 37.5,
//             odd: 12.5,
//             even: 12.5,
//         });

//         it("should call super.getBetPercentage", () => {
//             // act
//             const actual = consumer.getBetPercentage({});

//             // assert
//             expect(EventConsumers.InGameConsumer.prototype.getBetPercentage).toHaveBeenCalled();
//         });

//         it("should return correct", () => {
//             // act
//             const actual = consumer.getBetPercentage({});

//             // assert
//             expect(actual).toStrictEqual({ over: 37, under: 37, odd: 12, even: 14 });
//         });
//     });

//     describe("getCurrentRoundData", () => {
//         beforeEach(() => {
//             jest.spyOn(EventConsumers.InGameConsumer.prototype, "getCurrentRoundData").mockReturnValue({
//                 drawId: 3,
//             });
//             (consumer.gameData as GameData).roundResult = [
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
//             ];
//         });

//         it("should call super.getCurrentRoundData", () => {
//             // act
//             consumer.getCurrentRoundData();

//             // assert
//             expect(EventConsumers.InGameConsumer.prototype.getCurrentRoundData).toHaveBeenCalled();
//         });

//         it("should return correct", () => {
//             //Arrange
//             const expectedRoundData = {
//                 drawId: 3,
//                 balls: [1, 2, 3],
//             };
//             // Act
//             const actual = consumer.getCurrentRoundData();

//             // Assert
//             expect(actual).toEqual(expectedRoundData);
//         });
//     });
// });
