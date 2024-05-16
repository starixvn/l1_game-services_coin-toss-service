import { asClass, asValue } from "awilix";
import { ContainerRegistry } from "sc-game-base/src/core";
import { RunningRoundInfoPublisher } from "./event-publishers";
import { betLogs, bets, results, rounds, tmpBets } from "./models/index";

export default class CoinTossContainerRegistry extends ContainerRegistry {
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
