import { UserDisconnectConsumer } from "sc-game-base/src/core/event-consumers";
import { Socket } from "socket.io";
import GameData from "../game-data";

export default class OutGameConsumer extends UserDisconnectConsumer {
    consume(socketClient: Socket) {
        const realPlayer = this.gameData.realPlayers[socketClient.id];

        if (realPlayer) {
            delete (this.gameData as GameData).players[realPlayer.UID];
        }

        super.consume(socketClient);
    }
}
