import { Server, Socket } from 'socket.io';
import { AwilixContainer } from 'awilix';
import { Table } from 'sc-game-base';
import BaseViewRouter from './routers/base-view-router';

interface GameApp {
    socketServer: Server;
}

export const registerViewModule = (
    app: GameApp,
    container: AwilixContainer,
    definition: Table.TableGameDefinition
): void => {
    const gameNameInSocketNamespace = definition.name.toLowerCase();
    console.log("[registerViewModule] Registering view module", {
        gameName: definition.name,
        gameNameInSocketNamespace,
        socketServerExists: !!app.socketServer
    });

    app.socketServer.of(`/view/${gameNameInSocketNamespace}`).on("connection", (socketClient: Socket) => {
        console.log("[registerViewModule] New socket connection", {
            socketId: socketClient.id,
            namespace: `/view/${gameNameInSocketNamespace}`
        });

        const baseViewRouter = container.resolve<BaseViewRouter>("baseViewRouter");
        console.log("[registerViewModule] Resolved baseViewRouter", {
            routerExists: !!baseViewRouter
        });

        baseViewRouter.init(socketClient);
        console.log("[registerViewModule] Initialized baseViewRouter with socket", {
            socketId: socketClient.id
        });
    });
}; 