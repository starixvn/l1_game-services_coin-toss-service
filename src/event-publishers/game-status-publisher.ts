import { GameStatusPublisher as GameStatusPublisherBase } from "sc-game-base/src/core/event-publishers";
import GameData from "../game-data";

export default class GameStatusPublisher extends GameStatusPublisherBase {
    override publishToAllUsers(payload: any): void {
        console.log('[GameStatusPublisher] Publishing to all users', {
            gameName: this.gameName,
            payloadKeys: Object.keys(payload)
        });
        super.publishToAllUsers(payload);

        const gameData = this.gameData as GameData;
        console.log('[GameStatusPublisher] Publishing to view players', {
            viewPlayersCount: Object.keys(gameData.viewPlayers || {}).length
        });
        Object.values(gameData.viewPlayers).forEach((socket) => {
            console.log('[GameStatusPublisher] Emitting to socket', { socketId: socket?.id });
            socket && socket.emit(this.gameName, payload);
        });
    }

    override publishEnablingGameStatus(): void {
        console.log('[GameStatusPublisher] Publishing enabling game status');
        super.publishEnablingGameStatus();

        const { gameConfigs, remainingTime } = this.gameData;
        const configs = {
            odds: gameConfigs.odds,
            originalOdds: gameConfigs.originalOdds,
            enableFreeBet: gameConfigs.enableFreeBet,
        };
        console.log('[GameStatusPublisher] Game configs to publish', {
            remainingTime,
            oddsCount: Object.keys(gameConfigs.odds || {}).length
        });

        const gameData = this.gameData as GameData;
        Object.values(gameData.viewPlayers).forEach((socket) => {
            const payload = { gameConfigs: { ...configs }, remainingTime, snr: true };
            console.log('[GameStatusPublisher] Emitting enabling status to socket', {
                socketId: socket?.id,
                remainingTime
            });
            socket && socket.emit(this.gameName, payload);
        });
    }
} 