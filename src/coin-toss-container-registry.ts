import { AwilixContainer, asClass, asValue } from "awilix";
import { Table } from "sc-game-base";
import { TableContainerRegistry } from "sc-game-base/src/table";
import { Bot, GameCron, ProcessBetQueue } from "./crons";
import { InGameConsumer, UserSignInConsumer } from "./event-consumers";
import { RunningRoundInfoPublisher } from "./event-publishers";
import GameData from "./game-data";
import { betLogs, bets, results, rounds, tmpBets } from "./models/index";

export default class CoinTossContainerRegistry extends TableContainerRegistry {
    register(appConfigs: any, definition: Table.TableGameDefinition, gameData: GameData): AwilixContainer<any> {
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

    registerConsumers() {
        super.registerConsumers();

        this.container.register({
            inGameConsumer: asClass(InGameConsumer).singleton(),
            userSignInConsumer: asClass(UserSignInConsumer).singleton()
        });
    }

    registerCrons() {
        super.registerCrons();

        this.container.register({
            bot: asClass(Bot).singleton(),
            gameCron: asClass(GameCron).singleton().proxy(),
            processBetQueue: asClass(ProcessBetQueue).singleton().proxy(),
        });
    }
}
