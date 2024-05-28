import GameManagementApiClientFactory from "sc-game-base/src/core/game-management-api";
import { PlayGamePermissionValidator } from "sc-game-base/src/core/validators";
import { TableGameDefinition } from "sc-game-base/src/table";
import { TableUserSignInConsumer } from "sc-game-base/src/table/event-consumers";
import { TableUserSignInPublisher } from "sc-game-base/src/table/event-publishers";
import { UserInfos } from "sc-game-management-client";
import { Socket } from "socket.io";
import GameData from "../game-data";
export default class UserSignInConsumer extends TableUserSignInConsumer {
    constructor(
        definition: TableGameDefinition,
        gameData: GameData,
        userSignInPublisher: TableUserSignInPublisher,
        playGamePermissionValidator: PlayGamePermissionValidator,
        appConfigs: any,
        gameManagementApiClientFactory: GameManagementApiClientFactory
    ) {
        super(definition, gameData, userSignInPublisher, playGamePermissionValidator, appConfigs, gameManagementApiClientFactory);
    }

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
