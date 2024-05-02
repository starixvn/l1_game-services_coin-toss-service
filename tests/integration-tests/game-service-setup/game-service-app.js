import { Core } from "sc-game-base";
import TableGameData from "sc-game-base/src/table/table-game-data";
import TableGameDefinition from "sc-game-base/src/table/table-game-definition";
import { initAPIStub, stubUserService, subGameManagementService } from "sc-game-service-integration-utils";
import CoinTossContainerRegistry from "../../../build/coin-toss-container-registry";

import appConfigs from "../../../build/app-configs.IGT";
import { resultHelper } from "../../../build/helpers";
import gameSettings from "../_stubs/game-settings";

export const run = async () => {
    initAPIStub(appConfigs.apiSettings.apiUrl);
    const definition = new TableGameDefinition(
        gameSettings,
        resultHelper.generateResult,
        resultHelper.getSettlementResult,
        resultHelper.generateRawResultForHash
    );
    const gameData = new TableGameData(gameSettings.durations.wholeRound);
    stubUserService(appConfigs);
    subGameManagementService(appConfigs, definition);
    const container = new CoinTossContainerRegistry().register(appConfigs, definition, gameData);
    const app = new Core.BaseGameApp(gameSettings.name, appConfigs);
    await app.run();
    await app.startGame(container);
};

run();
