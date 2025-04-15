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

    app.socketServer.of(`/view/${gameNameInSocketNamespace}`).on("connection", (socketClient: Socket) => {
        const baseViewRouter = container.resolve<BaseViewRouter>("baseViewRouter");
        baseViewRouter.init(socketClient);
    });
}; 