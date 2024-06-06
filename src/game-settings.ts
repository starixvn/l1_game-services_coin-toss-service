import { BET_CHOICES } from "./constants";

export default {
    id: 80,
    name: "CoinToss",
    durations: {
        wholeRound: 29,
        flipTheCoin: 3,
        placingBets: 20,
        lockingBet: 3,
        mergeClientSeeds: 1,
    },
    choices: Object.values(BET_CHOICES),
    choicesMapper: { head: 1, tail: 2 },
    hedgeBetGroups: [[BET_CHOICES.head, BET_CHOICES.tail]],
    numberOfRoundHistory: 100,
    provablyFair: true,
    botSettings: {
        ratio: { headOption: 50, tailOption: 50 },
        headOption: [BET_CHOICES.head],
        tailOption: [BET_CHOICES.tail],
    },
};
