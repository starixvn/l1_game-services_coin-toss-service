jest.mock('sc-common', () => ({
    helpers: {
        noticeHelper: {
            placeBetNextRound: 'next-round',
            invalidBet: 'invalid-bet',
            cannotPlaceBet: 'cannot-bet',
        }
    }
}));

import PlaceBetConsumer from '../../../src/event-consumers/place-bet-consumer';

jest.mock('../../../src/game-settings', () => ({
    durations: { flipTheCoin: 5 }
}));

describe('PlaceBetConsumer', () => {
    let consumer: PlaceBetConsumer;
    let mockGameData: any;
    let mockDefinition: any;

    beforeEach(() => {
        mockGameData = {
            gameConfigs: { enabled: true },
            remainingTime: 10,
            roundId: 1,
        };
        mockDefinition = {
            durations: {
                placingBets: 10,
                lockingBet: 2,
            },
        };
        const mockPublisher = {
            gameName: 'test-game',
            gameData: mockGameData,
            publishToAllUsers: jest.fn(),
            publishToAllUsersExcept: jest.fn(),
            publishToAllUsersExceptSystem: jest.fn(),
            publishToUser: jest.fn(),
            publishToAllAdmins: jest.fn(),
            publishApiError: jest.fn(),
        };
        consumer = new PlaceBetConsumer(mockDefinition, mockGameData, mockPublisher);
        (consumer as any).gameData = mockGameData;
        (consumer as any).definition = mockDefinition;
    });

    it('should return failure for !configs.enabled', () => {
        mockGameData.gameConfigs.enabled = false;
        const result = consumer.composeBettingTimeValidationCriteria(1);
        expect(result[0].failure).toBe(true);
        expect(result[0].notice).toEqual({ errorCode: 'next-round' });
    });

    it('should return failure for roundId !== gameData.roundId', () => {
        const result = consumer.composeBettingTimeValidationCriteria(2);
        expect(result[1].failure).toBe(true);
        expect(result[1].notice).toEqual({ errorCode: 'invalid-bet', gameRoundId: 2 });
    });

    it('should return failure for remainingTime in placingBets..placingBets+flipTheCoin', () => {
        mockGameData.remainingTime = 12;
        const result = consumer.composeBettingTimeValidationCriteria(1);
        expect(result[2].failure).toBe(true);
        expect(result[2].notice).toEqual({ errorCode: 'cannot-bet' });
    });

    it('should return failure for remainingTime < lockingBet', () => {
        mockGameData.remainingTime = 1;
        const result = consumer.composeBettingTimeValidationCriteria(1);
        expect(result[3].failure).toBe(true);
        expect(result[3].notice).toEqual({ errorCode: 'next-round' });
    });

    it('should return failure for remainingTime > placingBets+flipTheCoin', () => {
        mockGameData.remainingTime = 20;
        const result = consumer.composeBettingTimeValidationCriteria(1);
        expect(result[3].failure).toBe(true);
        expect(result[3].notice).toEqual({ errorCode: 'next-round' });
    });

    it('should return no failures for valid state', () => {
        mockGameData.remainingTime = 5;
        const result = consumer.composeBettingTimeValidationCriteria(1);
        expect(result.every(r => !r.failure)).toBe(true);
    });
}); 