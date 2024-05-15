import { BET_CHOICES } from "../constants";

export const roundBetPercentage = (betPercentage: Record<string, number>) => {
    betPercentage[BET_CHOICES.head] && (betPercentage[BET_CHOICES.head] = parseInt(betPercentage[BET_CHOICES.head].toString()));
    betPercentage[BET_CHOICES.tail] && (betPercentage[BET_CHOICES.tail] = parseInt(betPercentage[BET_CHOICES.tail].toString()));
    if (betPercentage[BET_CHOICES.head] > 0) {
        betPercentage[BET_CHOICES.head] = 100 - (betPercentage[BET_CHOICES.head] ?? 0) - (betPercentage[BET_CHOICES.tail] ?? 0);
    }

    return betPercentage;
};
