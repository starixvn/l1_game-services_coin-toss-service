import GameManagementApiClientFactory from "sc-game-base/src/core/game-management-api";
import { PlayGamePermissionValidator } from "sc-game-base/src/core/validators";
import { TableGameData, TableGameDefinition } from "sc-game-base/src/table";
import { TableUserSignInConsumer } from "sc-game-base/src/table/event-consumers";
import { TableUserSignInPublisher } from "sc-game-base/src/table/event-publishers";
import { UserInfos } from "sc-game-management-client";
import { Socket } from "socket.io";
export default class UserSignInConsumer extends TableUserSignInConsumer {
    constructor(
        definition: TableGameDefinition,
        gameData: TableGameData,
        userSignInPublisher: TableUserSignInPublisher,
        playGamePermissionValidator: PlayGamePermissionValidator,
        appConfigs: any,
        gameManagementApiClientFactory: GameManagementApiClientFactory
    ) {
        super(definition, gameData, userSignInPublisher, playGamePermissionValidator, appConfigs, gameManagementApiClientFactory);
    }

    handleSignInSuccess(socketClient: Socket, userInfo: UserInfos, userSession: any) {
        super.handleSignInSuccess(socketClient, userInfo, userSession);

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
