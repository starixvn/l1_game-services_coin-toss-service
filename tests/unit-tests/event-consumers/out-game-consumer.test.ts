import OutGameConsumer from '../../../src/event-consumers/out-game-consumer';
import GameData from '../../../src/game-data';
import { Socket } from 'socket.io';

describe('OutGameConsumer', () => {
    let consumer: OutGameConsumer;
    let mockGameData: any;
    let mockSocket: any;
    let mockSuperConsume: jest.SpyInstance;

    beforeEach(() => {
        mockGameData = new GameData(0);
        mockGameData.realPlayers = {};
        mockGameData.players = {};
        mockSocket = { id: 'socket123' };
        // Patch super.consume
        mockSuperConsume = jest.spyOn(Object.getPrototypeOf(OutGameConsumer.prototype), 'consume').mockImplementation();
        consumer = new OutGameConsumer(mockGameData);
        (consumer as any).gameData = mockGameData;
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('should delete player if realPlayer exists', () => {
        // Arrange
        const realPlayer = { UID: 'u1' };
        mockGameData.realPlayers[mockSocket.id] = realPlayer;
        mockGameData.players['u1'] = { id: 'u1', name: 'Alice' };

        // Act
        consumer.consume(mockSocket);

        // Assert
        expect(mockGameData.players['u1']).toBeUndefined();
        expect(mockSuperConsume).toHaveBeenCalledWith(mockSocket);
    });

    it('should not throw if realPlayer does not exist', () => {
        // Arrange
        mockGameData.realPlayers[mockSocket.id] = undefined;
        mockGameData.players['u1'] = { id: 'u1', name: 'Alice' };

        // Act
        expect(() => consumer.consume(mockSocket)).not.toThrow();

        // Assert
        expect(mockGameData.players['u1']).toBeDefined();
        expect(mockSuperConsume).toHaveBeenCalledWith(mockSocket);
    });

    it('should call super.consume always', () => {
        // Arrange
        mockGameData.realPlayers[mockSocket.id] = { UID: 'u1' };

        // Act
        consumer.consume(mockSocket);

        // Assert
        expect(mockSuperConsume).toHaveBeenCalledWith(mockSocket);
    });
}); 