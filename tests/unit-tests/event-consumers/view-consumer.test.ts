import { Socket } from "socket.io";
import { Table } from "sc-game-base";
import { RoundQuery } from "sc-game-base/src/core/query-apis";
import ViewConsumer from "../../../src/consumers/view-consumer";
import GameData from "../../../src/game-data";

describe("ViewConsumer", () => {
    // Arrange: Common test setup
    let viewConsumer: ViewConsumer;
    let mockDefinition: Table.TableGameDefinition;
    let mockGameData: GameData;
    let mockRoundQuery: jest.Mocked<RoundQuery>;
    let mockSocket: jest.Mocked<Socket>;

    beforeEach(() => {
        // Mock dependencies
        mockDefinition = {
            name: "test-game",
            numberOfRoundHistory: 5
        } as Table.TableGameDefinition;

        mockGameData = {
            remainingTime: 30,
            gameConfigs: {
                enabled: true,
                odds: { heads: 2, tails: 2 },
                originalOdds: { heads: 2, tails: 2 },
                enableFreeBet: true,
                boostedChoices: []
            },
            umMessages: [],
            delayStartTime: 0,
            totalBets: {},
            roundId: "round-123",
            playerBetCount: {},
            viewPlayers: {}
        } as unknown as GameData;

        mockRoundQuery = {
            getList: jest.fn()
        } as unknown as jest.Mocked<RoundQuery>;

        mockSocket = {
            emit: jest.fn()
        } as unknown as jest.Mocked<Socket>;

        viewConsumer = new ViewConsumer(mockDefinition, mockGameData, mockRoundQuery);
    });

    describe("consume", () => {
        it("should emit disabled game state when game is disabled", async () => {
            // Arrange
            mockGameData.gameConfigs.enabled = false;
            const id = "test-id";

            // Act
            await viewConsumer.consume(mockSocket, id);

            // Assert
            expect(mockSocket.emit).toHaveBeenCalledWith(
                mockDefinition.name,
                {
                    remainingTime: mockGameData.remainingTime,
                    um: true,
                    um_message: mockGameData.umMessages
                }
            );
        });

        it("should emit disabled game state when delayStartTime is greater than 0", async () => {
            // Arrange
            mockGameData.delayStartTime = 5;
            const id = "test-id";

            // Act
            await viewConsumer.consume(mockSocket, id);

            // Assert
            expect(mockSocket.emit).toHaveBeenCalledWith(
                mockDefinition.name,
                {
                    remainingTime: mockGameData.remainingTime,
                    um: true,
                    um_message: mockGameData.umMessages
                }
            );
        });

        it("should emit game state with payload when game is enabled", async () => {
            // Arrange
            const id = "test-id";
            const mockRoundHistory = [{ roundId: "round-1" }];
            mockRoundQuery.getList.mockResolvedValue(mockRoundHistory);

            // Act
            await viewConsumer.consume(mockSocket, id);

            // Assert
            expect(mockSocket.emit).toHaveBeenCalledWith(
                mockDefinition.name,
                {
                    [id]: {
                        remainingTime: mockGameData.remainingTime,
                        roundId: mockGameData.roundId,
                        gameConfigs: {
                            odds: mockGameData.gameConfigs.odds,
                            originalOdds: mockGameData.gameConfigs.originalOdds,
                            enableFreeBet: mockGameData.gameConfigs.enableFreeBet,
                            boostedChoices: mockGameData.gameConfigs.boostedChoices
                        },
                        roundHistory: mockRoundHistory,
                        ownBets: {},
                        totalBets: mockGameData.totalBets
                    }
                }
            );
        });
    });

    describe("buildPayload", () => {
        it("should build correct payload with all game data", async () => {
            // Arrange
            const mockRoundHistory = [{ roundId: "round-1" }];
            mockRoundQuery.getList.mockResolvedValue(mockRoundHistory);

            // Act
            const payload = await viewConsumer.buildPayload();

            // Assert
            expect(payload).toEqual({
                remainingTime: mockGameData.remainingTime,
                roundId: mockGameData.roundId,
                gameConfigs: {
                    odds: mockGameData.gameConfigs.odds,
                    originalOdds: mockGameData.gameConfigs.originalOdds,
                    enableFreeBet: mockGameData.gameConfigs.enableFreeBet,
                    boostedChoices: mockGameData.gameConfigs.boostedChoices
                },
                roundHistory: mockRoundHistory,
                ownBets: {},
                totalBets: mockGameData.totalBets
            });
            expect(mockRoundQuery.getList).toHaveBeenCalledWith(mockDefinition.numberOfRoundHistory);
        });

        it("should handle empty round history", async () => {
            // Arrange
            mockRoundQuery.getList.mockResolvedValue([]);

            // Act
            const payload = await viewConsumer.buildPayload();

            // Assert
            expect(payload.roundHistory).toEqual([]);
        });
    });
});
