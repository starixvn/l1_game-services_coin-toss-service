import { helpers } from "sc-common";
import { GameData, GameDefinition } from "sc-game-base/src/core";
import { BaseBot } from "sc-game-base/src/core/crons";
import { BotSettings } from "sc-game-base/src/core/game-definition";
import GameManagementApiClientFactory from "sc-game-base/src/core/game-management-api";

export default class Bot extends BaseBot {
    declare definition: GameDefinition;
    declare gameData: GameData;
    betOptions: string[];
    smallTicketRatio: number;
    smallTickets: number;
    allBets: Record<string, number>;
    hedgeBetGroups: any[];
    botChips: number[];
    botSettings: BotSettings;

    constructor(definition: GameDefinition, gameData: GameData, gameManagementApiClientFactory: GameManagementApiClientFactory) {
        super(definition, gameData, gameManagementApiClientFactory);
        this.betOptions = definition.choices;
        this.smallTicketRatio = 70;
        this.smallTickets = 0;
        this.botSettings = definition.botSettings;
        this.hedgeBetGroups = definition.hedgeBetGroups;
        this.allBets = {};
        this.botChips = [
            20_000_000, 5_000_000, 1_000_000, 500_000, 200_000, 100_000, 50_000, 20_000, 10_000, 2000, 1000, 500, 200, 100, 50, 10, 5, 1,
        ];
    }

    isDuringBetTime = () => this.gameData.remainingTime > this.definition.durations.lockingBet;

    resetAllBotData() {
        super.resetAllBotData();
        this.resetAllBets();
    }

    resetAllBets() {
        this.betOptions.forEach((opt: string) => {
            this.allBets[opt] = 0;
        });

        this.smallTickets = 0;
    }

    getBetChoice(bot: any) {
        const betChoiceRatios = this.getBetChoicesRatios();
        const underRatioGroups = helpers.arrayHelper.shuffle(betChoiceRatios.filter((data) => data.underBetRatio));
        const choice = underRatioGroups.length > 0 ? this.chance.pickone(underRatioGroups[0].group) : this.chance.pickone(this.betOptions);
        const hedgeBetGroup = this.hedgeBetGroups.find((group) => group.includes(choice));

        if (hedgeBetGroup) {
            const oppositeChoice = choice === hedgeBetGroup[0] ? hedgeBetGroup[1] : hedgeBetGroup[0];
            return bot.choices.includes(oppositeChoice) ? oppositeChoice : choice;
        } else {
            return choice;
        }
    }

    getBetChoicesRatios() {
        const totalBotBet = this.getAllBetAmountOnChoices(this.betOptions);
        return Object.keys(this.botSettings.ratio).map((group) => {
            const betOptions = this.botSettings[group] as string[];
            return {
                group: betOptions,
                underBetRatio: (this.getAllBetAmountOnChoices(betOptions) * 100) / totalBotBet < this.botSettings.ratio[group],
            };
        });
    }

    getAllBetAmountOnChoices(choices: string[]) {
        return choices.reduce((total, choice) => total + (this.allBets[choice] ?? 0), 0);
    }

    getMaxBet(_: any, choice: string) {
        const gameConfigs = this.gameData.gameConfigs;
        const minBet = this.getMinBet();
        const maxBetPerChoice = gameConfigs.choices_maxbet[choice];
        const botMaxBet = gameConfigs.bot_maxbet;
        const maxBet = Math.min(maxBetPerChoice, botMaxBet);
        const isSmallTicket = this.totalTickets === 0 ? true : (this.smallTickets * 100) / this.totalTickets < this.smallTicketRatio;
        const maxBetOfSmallTicket = Math.min(minBet * 50, botMaxBet * 0.3);
        return isSmallTicket ? maxBetOfSmallTicket : maxBet;
    }

    convertAmountToChip(amount: number) {
        const chipList = this.botChips.filter((chip) => amount / chip >= 1);

        return chipList.length > 0 ? chipList[0] : this.getMinBet();
    }

    async placeBet(bot: any): Promise<void> {
        const choice = this.getBetChoice(bot);
        const minBet = this.getMinBet();
        const maxBet = this.getMaxBet(bot, choice);
        const betAmount = this.convertAmountToChip(this.getBetAmount(minBet, maxBet));

        if (this.gameData.remainingTime > this.definition.durations.lockingBet) {
            this.gameData.totalBets[choice] = (this.gameData.totalBets[choice] ?? 0) + betAmount;
            this.allBets[choice] = (this.allBets[choice] ?? 0) + betAmount;
            this.totalTickets++;

            if (this.isSmallTicket(betAmount)) {
                this.smallTickets++;
            }
        }
    }

    getBetAmount(minBet: number, maxBet: number) {
        return this.chance.integer({ min: minBet, max: maxBet });
    }

    isSmallTicket(amount: number) {
        return amount <= this.getMinBet() * 50;
    }
}
