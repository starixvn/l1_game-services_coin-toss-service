import BaseViewRouter from '../../../src/routers/base-view-router';
import GameData from '../../../src/game-data';

describe('BaseViewRouter', () => {
    let mockSocket: any;
    let mockGameData: any;
    let mockLogService: any;
    let mockViewConsumer: any;
    let router: BaseViewRouter;

    beforeEach(() => {
        mockSocket = {
            id: 'socket123',
            on: jest.fn(),
        };
        mockGameData = new GameData(0);
        mockLogService = { logError: jest.fn() };
        mockViewConsumer = { consume: jest.fn().mockResolvedValue(undefined) };
        router = new BaseViewRouter({
            gameData: mockGameData,
            logService: mockLogService,
            viewConsumer: mockViewConsumer,
        });
    });

    describe('constructor', () => {
        it('should initialize dependencies', () => {
            expect(router).toBeInstanceOf(BaseViewRouter);
        });
    });

    describe('init', () => {
        it('should register inGame and disconnect handlers', () => {
            router.init(mockSocket);
            expect(mockSocket.on).toHaveBeenCalledWith('inGame', expect.any(Function));
            expect(mockSocket.on).toHaveBeenCalledWith('disconnect', expect.any(Function));
        });
    });

    describe('handleInGame', () => {
        it('should do nothing if verify returns false', async () => {
            jest.spyOn(router, 'verify').mockReturnValue(false);
            await router.handleInGame({ id: 'abc' });
            expect(mockViewConsumer.consume).not.toHaveBeenCalled();
        });

        it('should do nothing if socketClient is undefined', async () => {
            // Don't call init, so socketClient is undefined
            await router.handleInGame({ id: 'abc' });
            expect(mockViewConsumer.consume).not.toHaveBeenCalled();
        });

        it('should add socket to viewPlayers and call consume (happy path)', async () => {
            router.init(mockSocket);
            await router.handleInGame({ id: 'abc' });
            expect(mockGameData.viewPlayers[mockSocket.id]).toBe(mockSocket);
            expect(mockViewConsumer.consume).toHaveBeenCalledWith(mockSocket, 'abc');
        });

        it('should use empty string if id is not provided', async () => {
            router.init(mockSocket);
            await router.handleInGame();
            expect(mockViewConsumer.consume).toHaveBeenCalledWith(mockSocket, '');
        });

        it('should create viewPlayers if not present', async () => {
            mockGameData.viewPlayers = undefined;
            router = new BaseViewRouter({
                gameData: mockGameData,
                logService: mockLogService,
                viewConsumer: mockViewConsumer,
            });
            router.init(mockSocket);
            await router.handleInGame({ id: 'abc' });
            expect(mockGameData.viewPlayers[mockSocket.id]).toBe(mockSocket);
        });

        it('should log error if consume throws', async () => {
            router.init(mockSocket);
            mockViewConsumer.consume.mockRejectedValueOnce(new Error('fail'));
            await router.handleInGame({ id: 'abc' });
            expect(mockLogService.logError).toHaveBeenCalledWith(expect.any(Error));
        });
    });

    describe('handleDisconnect', () => {
        beforeEach(() => {
            jest.useFakeTimers();
        });
        afterEach(() => {
            jest.useRealTimers();
        });
        it('should remove socket from viewPlayers after disconnect', () => {
            router.init(mockSocket);
            mockGameData.viewPlayers[mockSocket.id] = mockSocket;
            router.handleDisconnect();
            jest.runAllTimers();
            expect(mockGameData.viewPlayers[mockSocket.id]).toBeUndefined();
        });
        it('should not throw if viewPlayers or socketClient is missing', () => {
            router = new BaseViewRouter({
                gameData: new GameData(0),
                logService: mockLogService,
                viewConsumer: mockViewConsumer,
            });
            // No init, so socketClient is undefined
            expect(() => router.handleDisconnect()).not.toThrow();
        });
        it('should log error if setTimeout throws', () => {
            router.init(mockSocket);
            const err = new Error('timeout fail');
            global.setTimeout = jest.fn(() => { throw err; }) as any;
            router.handleDisconnect();
            expect(mockLogService.logError).toHaveBeenCalledWith(err);
        });
    });

    describe('verify', () => {
        it('should return true', () => {
            expect(router.verify()).toBe(true);
        });
    });
}); 