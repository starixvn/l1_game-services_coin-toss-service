import { TableGameConfigBot } from "sc-game-base/src/table/crons";
import GameData from "../game-data";

export default class Bot extends TableGameConfigBot {
    updateBalanceAndPublishBetPayload(botId: string, choice: string, amount: number, balance: number) {
        if ((this.gameData as GameData).players[botId]) {
            (this.gameData as GameData).players[botId].red = balance;
        }
        this.updatePlayerBetCount(botId, choice);
    }

    updatePlayerBetCount(playerId: string, choice: string) {
        if (this.definition.choices.includes(choice)) {
            if (!(this.gameData as GameData).playerBetCount[choice]) {
                (this.gameData as GameData).playerBetCount[choice] = [];
            }
            !(this.gameData as GameData).playerBetCount[choice].includes(playerId) &&
                (this.gameData as GameData).playerBetCount[choice].push(playerId);
        }
    }

    override addToPlayersAndPublish(bot: any) {
        (this.gameData as GameData).players[bot.id] = bot;
    }

    override removeBot(botId: string) {
        delete (this.gameData as GameData).players[botId];
        delete (this.botsInRoom as any)[botId];
    }
}
