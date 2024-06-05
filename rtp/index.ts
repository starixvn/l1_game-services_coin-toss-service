import Chance from "chance";
import mongoose from "mongoose";
import { SeedHelper, ServerSeedHelper } from "sc-game-base/src/core/helpers";
import { ResultSchema } from "sc-game-base/src/core/models";
import { generateSeed } from "sc-pf-client-seed/dist";
import { generateResult, getSettlementResult } from "../src/helpers/result-helper";

const chance = new Chance();

const betChoices = ["head", "tail"];

const odds = {
    head: 1.96,
    tail: 1.96,
};

const generateClientSeeds = () => {
    return [generateSeed(), generateSeed(), generateSeed(), generateSeed(), generateSeed()];
};

const exportRtpResult = (randomMode = 1, numberOfRuns = 1_000_000, choices = betChoices) => {
    //connectToDatabase();
    runStasFromDB()
    return;
    const current = Date.now();

    const resultStat = {
        head: 0,
        tail: 0,
    };

    const resultProbability = {
        head: 0,
        tail: 0,
    };

    let totalWinAmount = 0;
    let winCount = 0;
    let totalBetAmount = 0;
    const winStreaks = {
        head: {},
        tail: {},
    };

    let winStreaksProbability = {
        head: {},
        tail: {},
    };
    let curChoice;
    let curStreak = 0;

    for (let index = 0; index < numberOfRuns; index++) {
        const betAmount = chance.pickone([1, 5, 10, 50, 100]);
        const choice = chance.pickone(choices);
        totalBetAmount += betAmount;

        const clientSeeds = generateClientSeeds();
        const serverSeed = ServerSeedHelper.generateServerSeed(randomMode);
        const mergeClientSeed = SeedHelper.getMergeClientSeed(clientSeeds);
        const mergeSeed = serverSeed + mergeClientSeed;
        const finalHash = SeedHelper.getSHA512Hash(mergeSeed);
        const result = generateResult(finalHash);
        const settlementResult = getSettlementResult(result);

        const winningChoice = Object.keys(settlementResult).find((choice) => settlementResult[choice]);
        Object.keys(settlementResult).forEach((key) => settlementResult[key] && resultStat[key]++);

        if (choice === winningChoice) {
            let winAmount = odds[choice] * betAmount;

            winCount++;
            totalWinAmount += winAmount;
        }

        if (curChoice != winningChoice) {
            if (curStreak >= 4) {
                winStreaks[curChoice][curStreak] = winStreaks[curChoice][curStreak] ? winStreaks[curChoice][curStreak] + 1 : 1;
                const num = winStreaks[curChoice][curStreak] / numberOfRuns;
                winStreaksProbability[curChoice][curStreak] = (Math.round(num * 100) / 100).toFixed(3);
            }

            curChoice = winningChoice;
            curStreak = 1;
        } else {
            curStreak++;
        }
    }
    resultProbability.head = resultStat.head / numberOfRuns;
    resultProbability.tail = resultStat.tail / numberOfRuns;
    console.log(`randomMode: ${randomMode}`);
    console.log("resultStat");
    console.log(resultStat);
    console.log("resultStatProbability");
    console.log(resultProbability);
    console.log("winStreaks");
    console.log(winStreaks);
    console.log("winStreaksProbability");
    console.log(winStreaksProbability);
    console.log("RTP");
    console.log({ rtp: totalWinAmount / totalBetAmount });
    const currentEnd = Date.now();
    console.log(`Run ${numberOfRuns} rounds in ${currentEnd - current}ms`);
};

const randomMode = 1;
const rounds = 1_00_000;

exportRtpResult(randomMode, rounds);

export async function connectToDatabase() {
    await mongoose.connect(
        "mongodb://lmn_backend:LmnBackend@10.10.50.12:39103,10.10.50.13:39103,10.10.50.14:39103/?replicaSet=L1pppLocal&appName=cointoss",
        {
            dbName: "minigame",
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }
    );

    console.log("connection to db success");

    const resultsModel = mongoose.model("cointoss_results", ResultSchema);
    const roundsModel = mongoose.model("cointoss_rounds", ResultSchema);

    const results = await resultsModel
        .find({ finalHash: { $eq: null } })
        .lean()
        .exec();
    let i = 0;
    try {
        for (const element of results) {
            const result = element;
            const round = await roundsModel.findOne({ id: result.roundId }).lean().exec();
            const mergeSeed = result.serverSeed + result.mergeClientSeed;
            const finalHash = SeedHelper.getSHA512Hash(mergeSeed);
            const resultFromFinalHash = generateResult(finalHash);
            const settlementResult = getSettlementResult(resultFromFinalHash);

            if (round.result.head != settlementResult.head && round.result) {
                console.log(`${round.id} - head: ${round.result.head} ${settlementResult.head}`);
                i++;
            }
        }
        console.log(`no.of round affect: ${i}`);
    } catch (error) {
    } finally {
        await mongoose.connection.close();
        console.log("close connection");
    }
}

export async function runStas() {
    await mongoose.connect(
        "mongodb://lmn_backend:LmnBackend@10.10.50.12:39103,10.10.50.13:39103,10.10.50.14:39103/?replicaSet=L1pppLocal&appName=cointoss",
        {
            dbName: "minigame",
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }
    );

    console.log("connection to db success");

    const resultsModel = mongoose.model("cointoss_results", ResultSchema);
    const roundsModel = mongoose.model("cointoss_rounds", ResultSchema);

    const results = await resultsModel
        .find({ roundId: { $gt: 60543 } })
        .lean()
        .exec();
    let i = 0;
    try {
        for (const element of results) {
            const result = element;
            const round = await roundsModel.findOne({ id: result.roundId }).lean().exec();
            const mergeSeed = result.serverSeed + result.mergeClientSeed;
            const finalHash = SeedHelper.getSHA512Hash(mergeSeed);
            const resultFromFinalHash = generateResult(finalHash);
            const settlementResult = getSettlementResult(resultFromFinalHash);

            // if (round.result.head != settlementResult.head && round.result) {
            //     console.log(`${round.id} - head: ${round.result.head} ${settlementResult.head}`);
            //     i++;
            // }
        }
        // console.log(`no.of round affect: ${i}`);
    } catch (error) {
    } finally {
        await mongoose.connection.close();
        console.log("close connection");
    }
}

async function runStasFromDB() {
    
    const current = Date.now();

    const resultStat = {
        head: 0,
        tail: 0,
    };

    const resultProbability = {
        head: 0,
        tail: 0,
    };

    let winCount = 0;
    const winStreaks = {
        head: {},
        tail: {},
    };

    let winStreaksProbability = {
        head: {},
        tail: {},
    };
    let curChoice;
    let curStreak = 0;
    await mongoose.connect(
        "mongodb://lmn_backend:LmnBackend@10.10.50.12:39103,10.10.50.13:39103,10.10.50.14:39103/?replicaSet=L1pppLocal&appName=cointoss",
        {
            dbName: "minigame",
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }
    );

    console.log("connection to db success");

    const resultsModel = mongoose.model("cointoss_results", ResultSchema);
    const roundsModel = mongoose.model("cointoss_rounds", ResultSchema);

    const results = await resultsModel
        .find({ roundId: { $gt: 60543 } })
        .lean()
        .exec();
    const numberOfRuns = results.length;
    try {
        for (const element of results) {
            const result = element;
            const round = await roundsModel.findOne({ id: result.roundId }).lean().exec();
            const choice = round.result.head ? "head" : "tail";

            const mergeSeed = result.serverSeed + result.mergeClientSeed;
            const finalHash = SeedHelper.getSHA512Hash(mergeSeed);
            const resultFromFinalHash = generateResult(finalHash);
            const settlementResult = getSettlementResult(resultFromFinalHash);

            const winningChoice = Object.keys(settlementResult).find((choice) => settlementResult[choice]);
            Object.keys(settlementResult).forEach((key) => settlementResult[key] && resultStat[key]++);

            if (choice === winningChoice) {
                winCount++;
            }

            if (curChoice != winningChoice) {
                if (curStreak >= 4) {
                    winStreaks[curChoice][curStreak] = winStreaks[curChoice][curStreak] ? winStreaks[curChoice][curStreak] + 1 : 1;
                    const num = winStreaks[curChoice][curStreak] / numberOfRuns;
                    winStreaksProbability[curChoice][curStreak] = (Math.round(num * 100) / 100).toFixed(3);
                }

                curChoice = winningChoice;
                curStreak = 1;
            } else {
                curStreak++;
            }
        }

        resultProbability.head = resultStat.head / numberOfRuns;
        resultProbability.tail = resultStat.tail / numberOfRuns;
        console.log("resultStat");
        console.log(resultStat);
        console.log("resultStatProbability");
        console.log(resultProbability);
        console.log("winStreaks");
        console.log(winStreaks);
        console.log("winStreaksProbability");
        console.log(winStreaksProbability);
        console.log("RTP");
        const currentEnd = Date.now();
        console.log(`Run ${numberOfRuns} rounds in ${currentEnd - current}ms`);
    } catch (error) {
    } finally {
        await mongoose.connection.close();
        console.log("close connection");
    }
}
