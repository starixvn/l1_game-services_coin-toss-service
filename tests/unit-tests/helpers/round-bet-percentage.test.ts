// import { roundBetPercentage } from "../../../src/helpers/round-bet-percentage";

// describe("round bet percentage tests", () => {
//     const testCases = [
//         {
//             betPercentage: {
//                 over: 24.5,
//                 under: 24.5,
//                 odd: 24.5,
//                 even: 26.5,
//             },

//             expected: {
//                 over: 24,
//                 under: 24,
//                 odd: 24,
//                 even: 28,
//             },
//         },
//         {
//             betPercentage: {
//                 over: 24.9,
//                 under: 24.9,
//                 odd: 24.9,
//                 even: 25.3,
//             },

//             expected: {
//                 over: 24,
//                 under: 24,
//                 odd: 24,
//                 even: 28,
//             },
//         },
//     ];
//     it.each(testCases)("should return expected", ({ betPercentage, expected }) => {
//         // act
//         const actual = roundBetPercentage(betPercentage);

//         // assert
//         expect(actual).toEqual(expected);
//     });
// });
