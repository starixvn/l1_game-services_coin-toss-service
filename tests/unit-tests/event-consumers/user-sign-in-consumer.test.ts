jest.mock('sc-game-base', () => {
    const actual = jest.requireActual('sc-game-base');
    return {
        ...actual,
        Core: {
            ...actual.Core,
            BaseEventConsumers: {
                ...actual.Core?.BaseEventConsumers,
                UserSignInConsumer: function () { /* no-op constructor */ }
            }
        }
    };
});

import UserSignInConsumer from '../../../src/event-consumers/user-sign-in-consumer';
import { Socket } from 'socket.io';
describe('UserSignInConsumer', () => {
    let consumer: UserSignInConsumer;
    let mockDefinition: any;
    let mockGameData: any;
    let mockUserSignInPublisher: any;
    let mockPlayGamePermissionValidator: any;
    let mockAppConfigs: any;
    let mockGameManagementApiClientFactory: any;
    let mockSocket: any;
    let mockUserInfo: any;
    let mockUserSession: any;

    beforeEach(() => {
        mockDefinition = { name: 'TestGame' };
        mockGameData = { realPlayers: {}, gameConfigs: { enabled: true }, delayStartTime: 0 };
        mockUserSignInPublisher = { publishToGameMessage: jest.fn() };
        mockPlayGamePermissionValidator = {};
        mockAppConfigs = {};
        mockGameManagementApiClientFactory = {};
        mockSocket = { emit: jest.fn() } as unknown as Socket;
        mockUserInfo = { name: 'Alice', minBet: 10, maxBet: 100 };
        mockUserSession = { userId: 'user-1' };

        consumer = new UserSignInConsumer(
            mockDefinition,
            mockGameData,
            mockUserSignInPublisher,
            mockPlayGamePermissionValidator,
            mockAppConfigs,
            mockGameManagementApiClientFactory
        );
        consumer.gameData = mockGameData;
        consumer.userSignInPublisher = mockUserSignInPublisher;
    });

    describe('handleSignInSuccess_happyPath_shouldStorePlayerAndEmit', () => {
        it('should store player, emit signedIn, and publish game message if enabled', () => {
            // Act
            consumer.handleSignInSuccess(mockSocket, mockUserInfo, mockUserSession);
            // Assert
            expect(mockGameData.realPlayers[mockSocket.id]).toBeDefined();
            expect(mockGameData.realPlayers[mockSocket.id].UID).toBe('user-1');
            expect(mockSocket.emit).toHaveBeenCalledWith('signedIn');
            expect(mockUserSignInPublisher.publishToGameMessage).toHaveBeenCalledWith(mockSocket, mockDefinition.name);
        });
    });

    describe('handleSignInSuccess_withGameDisabled_shouldNotPublishGameMessage', () => {
        it('should not publish game message if game is disabled', () => {
            // Arrange
            mockGameData.gameConfigs.enabled = false;
            // Act
            consumer.handleSignInSuccess(mockSocket, mockUserInfo, mockUserSession);
            // Assert
            expect(mockUserSignInPublisher.publishToGameMessage).not.toHaveBeenCalled();
        });
    });

    describe('handleSignInSuccess_withDelayStartTime_shouldNotPublishGameMessage', () => {
        it('should not publish game message if delayStartTime > 0', () => {
            // Arrange
            mockGameData.delayStartTime = 5;
            // Act
            consumer.handleSignInSuccess(mockSocket, mockUserInfo, mockUserSession);
            // Assert
            expect(mockUserSignInPublisher.publishToGameMessage).not.toHaveBeenCalled();
        });
    });

    describe('handleSignInSuccess_withMissingUserId_shouldHandleGracefully', () => {
        it('should not throw if userId is missing', () => {
            // Arrange
            mockUserSession = {};
            // Act & Assert
            expect(() => consumer.handleSignInSuccess(mockSocket, mockUserInfo, mockUserSession)).not.toThrow();
        });
    });

    describe('isEnable', () => {
        it('should return true if game is enabled and delayStartTime is 0', () => {
            // Act & Assert
            expect(consumer.isEnable()).toBe(true);
        });
        it('should return false if game is disabled', () => {
            // Arrange
            mockGameData.gameConfigs.enabled = false;
            // Act & Assert
            expect(consumer.isEnable()).toBe(false);
        });
        it('should return false if delayStartTime > 0', () => {
            // Arrange
            mockGameData.delayStartTime = 1;
            // Act & Assert
            expect(consumer.isEnable()).toBe(false);
        });
    });
}); 