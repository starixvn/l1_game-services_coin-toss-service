import { AwilixContainer, asClass, asValue } from "awilix";
import { Table } from "sc-game-base";
import { PlaceBetPublisher } from "sc-game-base/src/core/event-publishers";
import { TableContainerRegistry } from "sc-game-base/src/table";
import { Bot, GameCron, ProcessBetQueue } from "./crons";
import { InGameConsumer, OutGameConsumer, UserSignInConsumer, PlaceBetConsumer } from "./event-consumers";
import { RoundResultPublisher, RunningRoundInfoPublisher } from "./event-publishers";
import GameData from "./game-data";
import { betLogs, bets, results, rounds, tmpBets } from "./models/index";
import ViewConsumer from "./consumers/view-consumer";
import BaseViewRouter from "./routers/base-view-router";
import GameStatusPublisher from "./event-publishers/game-status-publisher";

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
            placeBetPublisher: asClass(PlaceBetPublisher).singleton(),
            roundResultPublisher: asClass(RoundResultPublisher).singleton(),
            gameStatusPublisher: asClass(GameStatusPublisher).singleton(),
        });
    }

    registerModels() {
        super.registerModels();

        this.container.register({
            roundsRepository: asValue(rounds),
            betsRepository: asValue(bets),
            tempBetsRepository: asValue(tmpBets),
            betLogsRepository: asValue(betLogs),
            resultsRepository: asValue(results)
        });
    }

    registerConsumers() {
        super.registerConsumers();

        this.container.register({
            inGameConsumer: asClass(InGameConsumer).singleton(),
            userDisconnectConsumer: asClass(OutGameConsumer).singleton(),
            userSignInConsumer: asClass(UserSignInConsumer).singleton(),
            placeBetConsumer: asClass(PlaceBetConsumer).singleton(),
            viewConsumer: asClass(ViewConsumer).singleton(),
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

    registerRouters() {
        super.registerRouters();

        this.container.register({
            baseViewRouter: asClass(BaseViewRouter).proxy(),
        });
    }
}
