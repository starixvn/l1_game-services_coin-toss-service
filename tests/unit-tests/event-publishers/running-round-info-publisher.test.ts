import RunningRoundInfoPublisher from '../../../src/event-publishers/running-round-info-publisher';

jest.mock('../../../src/helpers/bet-percentage', () => ({
    calculateUserBetPercentage: jest.fn(() => ({ head: 60, tail: 40 })),
    roundUserBetPercentage: jest.fn((p) => p),
}));

describe('RunningRoundInfoPublisher', () => {
    let publisher: RunningRoundInfoPublisher;
    let mockGameData: any;
    let mockEmit: jest.Mock;

    beforeEach(() => {
        mockGameData = { playerBetCount: {}, viewPlayers: {}, totalBets: 0, ingame: {} };
        mockEmit = jest.fn();
        publisher = new RunningRoundInfoPublisher('test-game', mockGameData);
        (publisher as any).gameData = mockGameData;
        (publisher as any).gameName = 'test-game';
        (publisher as any).publishToAllUsers = jest.fn();
        (publisher as any).publishToAllAdmins = jest.fn();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('should call super.publish and publishBetPercentage', () => {
        // Arrange
        const spy = jest.spyOn(publisher, 'publishBetPercentage');
        // Act
        publisher.publish();
        // Assert
        expect(spy).toHaveBeenCalled();
    });

    it('should emit userBetPercentage if playerBetCount has choices', () => {
        // Arrange
        mockGameData.playerBetCount = { head: ['a'], tail: ['b'] };
        // Act
        publisher.publishBetPercentage();
        // Assert
        expect(publisher.publishToAllUsers).toHaveBeenCalledWith({ userBetPercentage: { head: 60, tail: 40 } });
    });

    it('should not emit if playerBetCount is empty', () => {
        // Arrange
        mockGameData.playerBetCount = {};
        // Act
        publisher.publishBetPercentage();
        // Assert
        expect(publisher.publishToAllUsers).not.toHaveBeenCalled();
    });
}); 