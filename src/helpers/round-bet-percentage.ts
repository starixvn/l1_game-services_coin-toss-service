// import { BET_CHOICES } from "../constants";

// export const roundBetPercentage = (betPercentage: Record<string, number>) => {
//     betPercentage[BET_CHOICES.head] && (betPercentage[BET_CHOICES.head] = parseInt(betPercentage[BET_CHOICES.head].toString()));
//     betPercentage[BET_CHOICES.tail] && (betPercentage[BET_CHOICES.tail] = parseInt(betPercentage[BET_CHOICES.tail].toString()));
//     betPercentage[BET_CHOICES.odd] && (betPercentage[BET_CHOICES.odd] = parseInt(betPercentage[BET_CHOICES.odd].toString()));
//     if (betPercentage[BET_CHOICES.even] > 0) {
//         betPercentage[BET_CHOICES.even] =
//             100 - (betPercentage[BET_CHOICES.head] ?? 0) - (betPercentage[BET_CHOICES.tail] ?? 0) - (betPercentage[BET_CHOICES.odd] ?? 0);
//     }

//     return betPercentage;
// };
