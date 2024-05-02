import { asValue } from "awilix";
// import { InGameConsumer, RoundResultConsumer } from "./event-consumers";
// import { GameStatusPublisher } from "./event-publishers";
// import RunningRoundInfoPublisher from "./event-publishers/running-round-info-publisher";
import { TableContainerRegistry } from "sc-game-base/src/table";
import { betLogs, bets, results, rounds, tmpBets } from "./models/index";

export default class CoinTossContainerRegistry extends TableContainerRegistry {
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
