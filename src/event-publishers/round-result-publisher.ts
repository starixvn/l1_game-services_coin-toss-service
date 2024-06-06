import { RoundResultPublisher as RoundResultPublisherBase } from "sc-game-base/src/core/event-publishers";

export default class RoundResultPublisher extends RoundResultPublisherBase {
    override publishWinners(roundId: number, winningPlayers: any) {}
}
