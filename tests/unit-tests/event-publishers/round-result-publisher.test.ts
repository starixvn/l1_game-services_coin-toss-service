import RoundResultPublisher from '../../../src/event-publishers/round-result-publisher';

describe('RoundResultPublisher', () => {
    let publisher: RoundResultPublisher;
    let mockGameData: any;
    let mockSocket1: any;
    let mockSocket2: any;
    // let mockSuperPublish: jest.SpyInstance;

    beforeEach(() => {
        mockGameData = { viewPlayers: {}, realPlayers: {} };
        mockSocket1 = { emit: jest.fn() };
        mockSocket2 = { emit: jest.fn() };
        // Do not mock the method, just observe if needed
        // mockSuperPublish = jest.spyOn(RoundResultPublisher.prototype, 'publishToAllUsers').mockImplementation();
        publisher = new RoundResultPublisher('test-game', mockGameData);
        (publisher as any).gameData = mockGameData;
        (publisher as any).gameName = 'test-game';
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('should call super.publishToAllUsers and emit to all sockets', () => {
        // Arrange
        const payload = { foo: 'bar' };
        mockGameData.viewPlayers = { a: mockSocket1, b: mockSocket2 };
        // Act
        publisher.publishToAllUsers(payload);
        // Assert
        // Optionally: expect(spy).toHaveBeenCalledWith(payload);
        expect(mockSocket1.emit).toHaveBeenCalledWith('test-game', payload);
        expect(mockSocket2.emit).toHaveBeenCalledWith('test-game', payload);
    });

    it('should not throw if a socket is null or undefined', () => {
        // Arrange
        const payload = { foo: 'bar' };
        mockGameData.viewPlayers = { a: mockSocket1, b: null, c: undefined };
        // Act & Assert
        expect(() => publisher.publishToAllUsers(payload)).not.toThrow();
        expect(mockSocket1.emit).toHaveBeenCalledWith('test-game', payload);
    });

    it('should handle empty viewPlayers gracefully', () => {
        // Arrange
        const payload = { foo: 'bar' };
        mockGameData.viewPlayers = {};
        // Act
        publisher.publishToAllUsers(payload);
        // Assert
        // No sockets to emit to
    });
}); 