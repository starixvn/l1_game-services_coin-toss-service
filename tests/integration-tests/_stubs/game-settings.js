export default {
    id: 80,
    name: "CoinToss",
    configName: "cointoss",
    durations: {
        wholeRound: 29,
        flipTheCoin: 3,
        placingBets: 20,
        lockingBet: 3,
        mergeClientSeeds: 0,
    },
    choices: ["head", "tail"],
    choicesMapper: { head: 1, tail: 2 },
    hedgeBetGroups: [["head", "tail"]],
    provablyFair: true,
};
