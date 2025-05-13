import { registerViewModule } from '../../../src/register-view-module';

// Arrange: Mocks for external dependencies
const mockOn = jest.fn();
const mockOf = jest.fn(() => ({ on: mockOn }));
const mockSocketServer = { of: mockOf };
const mockInit = jest.fn();
const mockBaseViewRouter = { init: mockInit };
const mockResolve = jest.fn(() => mockBaseViewRouter);
const mockContainer = { resolve: mockResolve };
const mockSocketClient = {};
const mockDefinition = { name: 'CoinToss' };

describe('registerViewModule', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should register the correct namespace and connection handler (happy path)', () => {
        // Act
        registerViewModule(
            { socketServer: mockSocketServer as any },
            mockContainer as any,
            mockDefinition as any
        );

        // Assert
        expect(mockOf).toHaveBeenCalledWith('/view/cointoss');
        expect(mockOn).toHaveBeenCalledWith('connection', expect.any(Function));
    });

    it('should resolve baseViewRouter and call init on connection', () => {
        // Arrange
        registerViewModule(
            { socketServer: mockSocketServer as any },
            mockContainer as any,
            mockDefinition as any
        );
        // Act
        // Simulate a connection event
        const connectionHandler = mockOn.mock.calls[0][1];
        connectionHandler(mockSocketClient);

        // Assert
        expect(mockResolve).toHaveBeenCalledWith('baseViewRouter');
        expect(mockInit).toHaveBeenCalledWith(mockSocketClient);
    });

    it('should handle definition.name with uppercase and special characters', () => {
        // Arrange
        const def = { name: 'My-Game_123' };
        // Act
        registerViewModule(
            { socketServer: mockSocketServer as any },
            mockContainer as any,
            def as any
        );
        // Assert
        expect(mockOf).toHaveBeenCalledWith('/view/my-game_123');
    });

    it('should throw if container.resolve throws (error handling)', () => {
        // Arrange
        mockResolve.mockImplementationOnce(() => { throw new Error('DI error'); });
        registerViewModule(
            { socketServer: mockSocketServer as any },
            mockContainer as any,
            mockDefinition as any
        );
        const connectionHandler = mockOn.mock.calls[0][1];
        // Act & Assert
        expect(() => connectionHandler(mockSocketClient)).toThrow('DI error');
    });

    it('should throw if baseViewRouter.init throws (error handling)', () => {
        // Arrange
        mockInit.mockImplementationOnce(() => { throw new Error('Init error'); });
        registerViewModule(
            { socketServer: mockSocketServer as any },
            mockContainer as any,
            mockDefinition as any
        );
        const connectionHandler = mockOn.mock.calls[0][1];
        // Act & Assert
        expect(() => connectionHandler(mockSocketClient)).toThrow('Init error');
    });
}); 