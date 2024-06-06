import { BET_CHOICES } from "../constants";

export const roundUserBetPercentage = (percentage: Record<string, number>) => {
    if (!percentage[BET_CHOICES.head] && !percentage[BET_CHOICES.tail]) {
        percentage[BET_CHOICES.head] = 0;
        percentage[BET_CHOICES.tail] = 0;
    } else {
        percentage[BET_CHOICES.head] && (percentage[BET_CHOICES.head] = parseInt(percentage[BET_CHOICES.head].toString()));
        percentage[BET_CHOICES.tail] && (percentage[BET_CHOICES.tail] = parseInt(percentage[BET_CHOICES.tail].toString()));
        if (percentage[BET_CHOICES.head] > 0) {
            percentage[BET_CHOICES.tail] = 100 - (percentage[BET_CHOICES.head] ?? 0);
        } else {
            percentage[BET_CHOICES.head] = 100 - (percentage[BET_CHOICES.tail] ?? 0);
        }
    }

    return percentage;
};

export const calculateUserBetPercentage = (playerBetCount: Record<string, string[]>): Record<string, number> => {
    const total = Object.values(playerBetCount).reduce((t, count) => t + count.length, 0);
    return Object.keys(playerBetCount).reduce((result, choice) => {
        result[choice] = parseFloat(((playerBetCount[choice].length * 100) / total).toFixed(2));
        return result;
    }, {} as Record<string, number>);
};
