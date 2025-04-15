import { Socket } from "socket.io";
import GameData from "../game-data";
import { Table } from "sc-game-base";

interface ConsumerInterface {
    consume(socketClient: Socket, id?: string): Promise<void>;
}

interface LogService {
    logError(error: Error | unknown): void;
}

interface HistoryQuery {
    getList(count: number): Promise<any[]>;
}

interface RouterDependencies {
    definition: Table.TableGameDefinition;
    gameData: GameData;
    userSignInConsumer: ConsumerInterface;
    inGameConsumer: ConsumerInterface;
    placeBetConsumer: ConsumerInterface;
    userDisconnectConsumer: ConsumerInterface;
    userSignInPublisher: any;
    historyQuery: HistoryQuery;
    logService: LogService;
    playGamePermissionValidator: any;
    viewConsumer: ConsumerInterface;
}

export default class BaseViewRouter {
    protected definition: Table.TableGameDefinition;
    protected gameData: GameData;
    protected userSignInConsumer: ConsumerInterface;
    protected inGameConsumer: ConsumerInterface;
    protected placeBetConsumer: ConsumerInterface;
    protected userDisconnectConsumer: ConsumerInterface;
    protected userSignInPublisher: any;
    protected historyQuery: HistoryQuery;
    protected logService: LogService;
    protected playGamePermissionValidator: any;
    protected viewConsumer: ConsumerInterface;
    protected socketClient!: Socket;

    constructor({
        definition,
        gameData,
        userSignInConsumer,
        inGameConsumer,
        placeBetConsumer,
        userDisconnectConsumer,
        userSignInPublisher,
        historyQuery,
        logService,
        playGamePermissionValidator,
        viewConsumer,
    }: RouterDependencies) {
        console.log('[BaseViewRouter] Constructor initialized', {
            gameName: definition.name,
            gameDataState: Object.keys(gameData)
        });
        this.definition = definition;
        this.gameData = gameData;
        this.userSignInConsumer = userSignInConsumer;
        this.inGameConsumer = inGameConsumer;
        this.placeBetConsumer = placeBetConsumer;
        this.userDisconnectConsumer = userDisconnectConsumer;
        this.userSignInPublisher = userSignInPublisher;
        this.historyQuery = historyQuery;
        this.logService = logService;
        this.playGamePermissionValidator = playGamePermissionValidator;
        this.viewConsumer = viewConsumer;
    }

    /**
     * Initialize socket client connections
     */
    init(socketClient: Socket): void {
        console.log('[BaseViewRouter] Initializing socket client', { socketId: socketClient.id });
        this.socketClient = socketClient;
        this.socketClient.on("inGame", this.handleInGame.bind(this));
        this.socketClient.on("disconnect", this.handleDisconnect.bind(this));
        console.log('[BaseViewRouter] Socket event handlers attached', { socketId: socketClient.id });
    }

    async handleInGame(payload?: { id?: string }): Promise<void> {
        console.log('[BaseViewRouter] handleInGame called', {
            socketId: this.socketClient?.id,
            payload
        });
        try {
            if (!this.verify()) {
                console.log('[BaseViewRouter] Verification failed');
                return;
            }

            if (!this.gameData.viewPlayers) {
                console.log('[BaseViewRouter] Creating viewPlayers object');
                this.gameData.viewPlayers = {};
            }

            console.log('[BaseViewRouter] Adding client to viewPlayers', {
                socketId: this.socketClient.id
            });
            this.gameData.viewPlayers[this.socketClient.id] = this.socketClient;
            console.log('[BaseViewRouter] Calling viewConsumer.consume');
            await this.viewConsumer.consume(this.socketClient, payload?.id);
            console.log('[BaseViewRouter] viewConsumer.consume completed');
        } catch (error) {
            console.error('[BaseViewRouter] Error in handleInGame', error);
            this.logService.logError(error);
        }
    }

    handleDisconnect(): void {
        console.log('[BaseViewRouter] handleDisconnect called', {
            socketId: this.socketClient?.id
        });
        try {
            setTimeout(() => {
                console.log('[BaseViewRouter] Removing client from viewPlayers', {
                    socketId: this.socketClient?.id
                });
                if (this.gameData.viewPlayers && this.socketClient) {
                    delete this.gameData.viewPlayers[this.socketClient.id];
                }
            });
        } catch (error) {
            console.error('[BaseViewRouter] Error in handleDisconnect', error);
            this.logService.logError(error);
        }
    }

    verify(): boolean {
        console.log('[BaseViewRouter] Verifying client');
        return true;
    }
} 