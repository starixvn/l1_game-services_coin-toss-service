import { Core } from "sc-game-base";
import { GameDefinition } from "sc-game-base/src/core";
import appConfigs from "./app-configs";
import CoinTossContainerRegistry from "./coin-toss-container-registry";
import GameData from "./game-data";
import gameSettings from "./game-settings";
import { resultHelper } from "./helpers";

const run = async () => {
    const definition = new GameDefinition(
        gameSettings,
        resultHelper.generateResult,
        resultHelper.getSettlementResult,
        resultHelper.generateRawResultForHash
        // ,resultHelper.getProbabilities
    );

    const gameData = new GameData(gameSettings.durations.wholeRound);

    const container = new CoinTossContainerRegistry().register(appConfigs, definition, gameData);

    const app = new Core.BaseGameApp(gameSettings.name, appConfigs);

    await app.run();

    await app.startGame(container);
};

run();
