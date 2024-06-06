import { GameClientDriver, normalUser } from "sc-game-service-integration-utils";
import { initUserSession } from "../helper/helper";
import { socketOptionsFunc } from "../_stubs/test-data";
import appConfigs from "../../../build/app-configs.IGT";
import { bets } from "../../../build/models";
import mongoose from "mongoose";

const socketOptions = socketOptionsFunc(appConfigs.hostingPort);

describe("unSettled round", () => {
    let client;

    beforeAll(async () => {
        client = new GameClientDriver(socketOptions, initUserSession(normalUser));

        const sendSignInInterval = setInterval(() => {
            client.sendSignInEvent();
        }, 500);

        await client.handleSignedInEvent();

        clearInterval(sendSignInInterval);

        await mongoose.disconnect();
        await mongoose.connect(appConfigs.database.url, appConfigs.database.options);
    });

    afterAll(async() => {
        client.close();
        client = null;
        await mongoose.disconnect();
        await mongoose.connection.close();
    });

    it("should settled all unsettled bets", async () => {
        // Act
        const unSettledBets = await bets.find({ drawId: 8 }).lean().exec();

        // Assert
        unSettledBets.forEach((bet) => {
            expect(bet.paid).toBe(true);
        });
    });
});
