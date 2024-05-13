import { BET_CHOICES } from "./constants";

export default {
    id: 80,
    name: "CoinToss",
    durations: {
        wholeRound: 29,
        flipTheCoin: 3,
        placingBets: 20,
        lockingBet: 3,
        mergeClientSeeds: 0,
    },
    choices: Object.values(BET_CHOICES),
    choicesMapper: { head: 1, tail: 2 },
    hedgeBetGroups: [[BET_CHOICES.head, BET_CHOICES.tail]],
    numberOfRoundHistory: 100,
    provablyFair: true,
    // botSettings: {
    //     ratio: { overUnderOptions: 50, oddEvenOptions: 50 },
    //     overUnderOptions: ["over", "under"],
    //     oddEvenOptions: ["odd", "even"],
    // },
};
