import { RoundResultPublisher as RoundResultPublisherBase } from "sc-game-base/src/core/event-publishers";
import GameData from "../game-data";
export default class RoundResultPublisher extends RoundResultPublisherBase {
    override publishWinners(roundId: number, winningPlayers: any) {
        console.log('[RoundResultPublisher] Publishing winners', {
            roundId,
            winningPlayersCount: Object.keys(winningPlayers || {}).length
        });
    }

    publishToAllUsers(payload: any) {
        console.log('[RoundResultPublisher] Publishing to all users', {
            gameName: this.gameName,
            payloadKeys: Object.keys(payload)
        });
        super.publishToAllUsers(payload);

        const gameData = this.gameData as GameData;
        console.log('[RoundResultPublisher] Publishing to view players', {
            viewPlayersCount: Object.keys(gameData.viewPlayers || {}).length
        });
        Object.values(gameData.viewPlayers).forEach((socket) => {
            console.log('[RoundResultPublisher] Emitting to socket', { socketId: socket?.id });
            socket && socket.emit(this.gameName, payload);
        });
    }
}
