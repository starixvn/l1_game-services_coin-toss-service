import { RunningRoundInfoPublisher as RunningRoundInfoPublisherBase } from "sc-game-base/src/core/event-publishers";

import GameData from "../game-data";

export default class RunningRoundInfoPublisher extends RunningRoundInfoPublisherBase {
    publish() {
        super.publish();

        //Update later for mini version
        //this.publishBetPercentage();
    }

    publishBetPercentage() {
        const { betCount } = this.gameData as GameData;
        const choices = Object.keys(betCount);
        if (choices.some((choice) => betCount[choice])) {
            const betPercentage = { head: 0, tail: 0 };
            betPercentage.head = Math.round(betCount.head / (betCount.head + betCount.tail));
            betPercentage.tail = 100 - betPercentage.head;
            this.publishToAllUsers({ betPercentage });
        }
    }
}
