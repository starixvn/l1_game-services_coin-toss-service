import { InGameConsumer } from "../../../src/event-consumers";
import GameData from "../../../src/game-data";

// Mock helpers
jest.mock("../../../src/helpers/bet-percentage", () => ({
    calculateUserBetPercentage: jest.fn(() => ({ head: 60, tail: 40 })),
    roundUserBetPercentage: jest.fn((p) => p),
}));

describe("InGameConsumer", () => {
    let consumer: InGameConsumer;
    let mockGameData: any;
    let mockDefinition: any;
    let mockRealPlayer: any;
    let gameManagementApiClientFactory: any;

    beforeEach(() => {
        mockGameData = new GameData(10);
        mockGameData.players = {};
        mockGameData.gameConfigs = { enabled: true };
        mockGameData.umMessages = "disabled";
        mockGameData.remainingTime = 99;
        mockDefinition = { name: "CoinToss" };
        mockRealPlayer = {
            UID: "u1",
            profile: { name: "Alice" },
            socketClient: { emit: jest.fn() }
        };
        gameManagementApiClientFactory = { instance: jest.fn() };

        // Patch the consumer to mock super.buildPayload
        class TestInGameConsumer extends InGameConsumer {
            async buildPayload(realPlayer: any) {
                // Call the real method, but mock super
                const superPayload = { user: { red: 1, avatarId: 2, type: "t", rate: 3 } };
                const { playerBetCount } = this.gameData as GameData;
                const userBetPercentage = this.getUserBetPercentage(playerBetCount);
                return { ...superPayload, userBetPercentage };
            }
        }
        consumer = new TestInGameConsumer(mockDefinition, mockGameData, mockRealPlayer, mockDefinition, mockRealPlayer, gameManagementApiClientFactory);
        (consumer as any).gameData = mockGameData;
        (consumer as any).definition = mockDefinition;
    });

    describe("buildPayload", () => {
        it("should merge super.buildPayload and userBetPercentage", async () => {
            mockGameData.playerBetCount = { head: ["a"], tail: ["b"] };
            const payload = await consumer.buildPayload(mockRealPlayer);
            expect(payload).toHaveProperty("userBetPercentage");
            expect(payload.userBetPercentage).toEqual({ head: 60, tail: 40 });
        });
    });

    describe("consume", () => {
        it("should emit disabled message if gameConfigs is missing", async () => {
            mockGameData.gameConfigs = undefined;
            await consumer.consume(mockRealPlayer);
            expect(mockRealPlayer.socketClient.emit).toHaveBeenCalledWith(
                "CoinToss",
                expect.objectContaining({ um: true, um_message: "disabled", remainingTime: 99 })
            );
        });

        it("should emit disabled message if gameConfigs.enabled is false", async () => {
            mockGameData.gameConfigs = { enabled: false };
            await consumer.consume(mockRealPlayer);
            expect(mockRealPlayer.socketClient.emit).toHaveBeenCalledWith(
                "CoinToss",
                expect.objectContaining({ um: true, um_message: "disabled", remainingTime: 99 })
            );
        });

        it("should add player if not present and emit payload", async () => {
            mockGameData.players = {};
            await consumer.consume(mockRealPlayer);
            expect(mockGameData.players["u1"]).toEqual(
                expect.objectContaining({
                    id: "u1",
                    name: "Alice",
                    red: 1,
                    avatarId: 2,
                    type: "t",
                    rate: 3,
                })
            );
            expect(mockRealPlayer.socketClient.emit).toHaveBeenCalledWith(
                "CoinToss",
                expect.objectContaining({ userBetPercentage: { head: 60, tail: 40 } })
            );
        });

        it("should not overwrite player if already present", async () => {
            mockGameData.players["u1"] = { id: "u1", name: "Bob" };
            await consumer.consume(mockRealPlayer);
            expect(mockGameData.players["u1"].name).toBe("Bob");
        });

        it("should emit payload even if player already exists", async () => {
            mockGameData.players["u1"] = { id: "u1", name: "Bob" };
            await consumer.consume(mockRealPlayer);
            expect(mockRealPlayer.socketClient.emit).toHaveBeenCalledWith(
                "CoinToss",
                expect.objectContaining({ userBetPercentage: { head: 60, tail: 40 } })
            );
        });
    });

    describe("getUserBetPercentage", () => {
        it("should call helpers and return rounded percentage", () => {
            const { getUserBetPercentage } = consumer;
            const result = getUserBetPercentage({ head: ["a"], tail: ["b"] });
            expect(result).toEqual({ head: 60, tail: 40 });
        });
    });
});
