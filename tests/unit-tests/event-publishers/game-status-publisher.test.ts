jest.mock("sc-game-base/src/table", () => ({
    TableGameData: class { }
}));

import GameStatusPublisher from "../../../src/event-publishers/game-status-publisher";
import GameData from "../../../src/game-data";

// Arrange: Helper to create a mock socket
const createMockSocket = () => ({
    emit: jest.fn()
});

describe("GameStatusPublisher", () => {
    let publisher: GameStatusPublisher;
    let mockGameData: GameData;

    beforeEach(() => {
        // Arrange: Set up fresh mocks and instance for each test
        jest.clearAllMocks();
        mockGameData = new GameData(10);
        (mockGameData as any).gameConfigs = {
            odds: 2,
            originalOdds: 3,
            enableFreeBet: true
        };
        (mockGameData as any).remainingTime = 42;
        (mockGameData as any).realPlayers = {};
        (mockGameData as any).admins = {};
        publisher = new GameStatusPublisher("test-game", mockGameData);
        (publisher as any).gameData = mockGameData;
        (publisher as any).gameName = "test-game";
    });

    describe("publishToAllUsers_withMultipleSockets_shouldEmitToAll", () => {
        it("should call base method and emit payload to all sockets", () => {
            // Arrange
            const payload = { foo: "bar" };
            const socket1 = createMockSocket();
            const socket2 = createMockSocket();
            mockGameData.viewPlayers = { a: socket1, b: socket2 };

            // Act
            publisher.publishToAllUsers(payload);

            // Assert
            expect(socket1.emit).toHaveBeenCalledWith("test-game", payload);
            expect(socket2.emit).toHaveBeenCalledWith("test-game", payload);
        });

        it("should not throw if a socket is null or undefined", () => {
            // Arrange
            const payload = { foo: "bar" };
            const socket1 = createMockSocket();
            mockGameData.viewPlayers = { a: socket1, b: null, c: undefined };

            // Act & Assert
            expect(() => publisher.publishToAllUsers(payload)).not.toThrow();
            expect(socket1.emit).toHaveBeenCalledWith("test-game", payload);
        });

        it("should handle empty viewPlayers gracefully", () => {
            // Arrange
            const payload = { foo: "bar" };
            mockGameData.viewPlayers = {};

            // Act
            publisher.publishToAllUsers(payload);

            // No sockets to emit to
        });
    });

    describe("publishEnablingGameStatus_withMultipleSockets_shouldEmitCorrectPayload", () => {
        it("should call base method and emit correct payload to all sockets", () => {
            // Arrange
            const socket1 = createMockSocket();
            const socket2 = createMockSocket();
            mockGameData.viewPlayers = { a: socket1, b: socket2 };

            // Act
            publisher.publishEnablingGameStatus();

            // Assert
            const expectedPayload = {
                gameConfigs: {
                    odds: 2,
                    originalOdds: 3,
                    enableFreeBet: true
                },
                remainingTime: 42,
                snr: true
            };
            expect(socket1.emit).toHaveBeenCalledWith("test-game", expectedPayload);
            expect(socket2.emit).toHaveBeenCalledWith("test-game", expectedPayload);
        });
        it("should not throw if a socket is null or undefined", () => {
            // Arrange
            const socket1 = createMockSocket();
            mockGameData.viewPlayers = { a: socket1, b: null, c: undefined };

            // Act & Assert
            expect(() => publisher.publishEnablingGameStatus()).not.toThrow();
            expect(socket1.emit).toHaveBeenCalledWith("test-game", {
                gameConfigs: {
                    odds: 2,
                    originalOdds: 3,
                    enableFreeBet: true
                },
                remainingTime: 42,
                snr: true
            });
        });

        it("should handle empty viewPlayers gracefully", () => {
            // Arrange
            mockGameData.viewPlayers = {};

            // Act
            publisher.publishEnablingGameStatus();

            // No sockets to emit to
        });

        it("should handle missing gameConfigs properties", () => {
            // Arrange
            (mockGameData as any).gameConfigs = {};
            const socket1 = createMockSocket();
            mockGameData.viewPlayers = { a: socket1 };

            // Act
            publisher.publishEnablingGameStatus();

            // Assert
            expect(socket1.emit).toHaveBeenCalledWith(
                "test-game",
                expect.objectContaining({
                    gameConfigs: {
                        odds: undefined,
                        originalOdds: undefined,
                        enableFreeBet: undefined
                    }
                })
            );
        });
    });
}); 