import { TableUserSignInConsumer } from "sc-game-base/src/table/event-consumers";
import { TableUserSignInPublisher } from "sc-game-base/src/table/event-publishers";
import { UserInfos } from "sc-game-management-client";
import { Socket } from "socket.io";
export default class UserSignInConsumer extends TableUserSignInConsumer {

    handleSignInSuccess(socketClient: Socket, userInfo: UserInfos, userSession: any) {
        const userData = {
            UID: userSession.userId,
            profile: { name: userInfo.name, minBet: userInfo.minBet, maxBet: userInfo.maxBet },
            session: userSession,
            socketClient,
        };

        userSession.characterName = userInfo.name;
        this.gameData.realPlayers[socketClient.id] = userData;

        socketClient.emit("signedIn");

        if (this.isEnable()) {
            (this.userSignInPublisher as TableUserSignInPublisher).publishToGameMessage(socketClient, this.definition.name);
        }
    }

    isEnable() {
        const configs = this.gameData.gameConfigs;
        const gameDisabled = !configs?.enabled;
        const disabled = gameDisabled || this.gameData.delayStartTime > 0;

        return !disabled;
    }
}
