import { Core, Table } from "sc-game-base";
import appConfigs from "./app-configs";
import CoinTossContainerRegistry from "./coin-toss-container-registry";
import GameData from "./game-data";
import gameSettings from "./game-settings";
import helper from "./helpers";
const resultHelper = helper.resultHelper;

const run = async () => {
    const definition = new Table.TableGameDefinition(
        gameSettings,
        resultHelper.generateResult,
        resultHelper.getSettlementResult,
        resultHelper.generateRawResultForHash
    );

    const gameData = new GameData(gameSettings.durations.wholeRound);

    const container = new CoinTossContainerRegistry().register(appConfigs, definition, gameData);

    const app = new Core.BaseGameApp(gameSettings.name, appConfigs);

    await app.run();

    await app.startGame(container);
};

run();
