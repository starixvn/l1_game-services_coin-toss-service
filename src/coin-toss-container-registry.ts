import { AwilixContainer, asClass, asValue } from "awilix";
import { Table } from "sc-game-base";
import { TableContainerRegistry } from "sc-game-base/src/table";
import { RunningRoundInfoPublisher } from "./event-publishers";
import { betLogs, bets, results, rounds, tmpBets } from "./models/index";

export default class CoinTossContainerRegistry extends TableContainerRegistry {
    register(appConfigs: any, definition: Table.TableGameDefinition, gameData: Table.TableGameData): AwilixContainer<any> {
        super.register(appConfigs, definition, gameData);
        this.registerPFSettings();

        return this.container;
    }

    registerPFSettings() {
        this.container.register({
            maxCombinedClientSeeds: asValue(5),
        });
    }

    registerPublishers() {
        super.registerPublishers();

        this.container.register({
            runningRoundInfoPublisher: asClass(RunningRoundInfoPublisher).singleton(),
        });
    }

    registerModels() {
        super.registerModels();

        this.container.register({
            roundsRepository: asValue(rounds),
            betsRepository: asValue(bets),
            tempBetsRepository: asValue(tmpBets),
            betLogsRepository: asValue(betLogs),
            resultsRepository: asValue(results),
        });
    }
}
