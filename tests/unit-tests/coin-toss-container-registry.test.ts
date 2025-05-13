import CoinTossContainerRegistry from '../../src/coin-toss-container-registry';

describe('CoinTossContainerRegistry', () => {
    let registry: CoinTossContainerRegistry;
    let mockContainer: any;

    beforeEach(() => {
        registry = new CoinTossContainerRegistry();
        mockContainer = {
            register: jest.fn().mockReturnThis(),
        };
        (registry as any).container = mockContainer;
    });

    it('should register PF settings', () => {
        // Act
        registry.registerPFSettings();
        // Assert
        expect(mockContainer.register).toHaveBeenCalledWith(
            expect.objectContaining({ maxCombinedClientSeeds: expect.any(Object) })
        );
    });

    it('should register publishers', () => {
        // Arrange
        (registry as any).super = { registerPublishers: jest.fn() };
        // Act
        registry.registerPublishers();
        // Assert
        expect(mockContainer.register).toHaveBeenCalledWith(
            expect.objectContaining({
                runningRoundInfoPublisher: expect.anything(),
                placeBetPublisher: expect.anything(),
                roundResultPublisher: expect.anything(),
                gameStatusPublisher: expect.anything(),
            })
        );
    });

    it('should register models', () => {
        (registry as any).super = { registerModels: jest.fn() };
        registry.registerModels();
        expect(mockContainer.register).toHaveBeenCalledWith(
            expect.objectContaining({
                roundsRepository: expect.anything(),
                betsRepository: expect.anything(),
                tempBetsRepository: expect.anything(),
                betLogsRepository: expect.anything(),
                resultsRepository: expect.anything(),
            })
        );
    });

    it('should register consumers', () => {
        (registry as any).super = { registerConsumers: jest.fn() };
        registry.registerConsumers();
        expect(mockContainer.register).toHaveBeenCalledWith(
            expect.objectContaining({
                inGameConsumer: expect.anything(),
                userDisconnectConsumer: expect.anything(),
                userSignInConsumer: expect.anything(),
                placeBetConsumer: expect.anything(),
                viewConsumer: expect.anything(),
            })
        );
    });

    it('should register crons', () => {
        (registry as any).super = { registerCrons: jest.fn() };
        registry.registerCrons();
        expect(mockContainer.register).toHaveBeenCalledWith(
            expect.objectContaining({
                bot: expect.anything(),
                gameCron: expect.anything(),
                processBetQueue: expect.anything(),
            })
        );
    });

    it('should register routers', () => {
        (registry as any).super = { registerRouters: jest.fn() };
        registry.registerRouters();
        expect(mockContainer.register).toHaveBeenCalledWith(
            expect.objectContaining({
                baseViewRouter: expect.anything(),
            })
        );
    });
}); 