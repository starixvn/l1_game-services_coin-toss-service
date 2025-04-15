import { RoundResultPublisher as RoundResultPublisherBase } from "sc-game-base/src/core/event-publishers";
import GameData from "../game-data";
export default class RoundResultPublisher extends RoundResultPublisherBase {
    override publishWinners(roundId: number, winningPlayers: any) {
        // Implementation without console.log
    }

    publishToAllUsers(payload: any) {
        super.publishToAllUsers(payload);

        const gameData = this.gameData as GameData;
        Object.values(gameData.viewPlayers).forEach((socket) => {
            socket && socket.emit(this.gameName, payload);
        });
    }
}
