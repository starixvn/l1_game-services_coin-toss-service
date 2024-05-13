import mongoose from "mongoose";

const modelName = "cointoss_rounds";

export type Result = {
    head: boolean;
    tail: boolean;
};

const resultSchema = new mongoose.Schema<Result>(
    {
        head: { type: Boolean, default: false },
        tail: { type: Boolean, default: false },
    },
    {
        _id: false,
    }
);

const Schema = new mongoose.Schema({
    id: { type: Number, required: true },
    result: { type: resultSchema },
    settlementResult: { type: resultSchema },
    time: { type: Date, default: new Date() },
    exchangeRateId: { type: Number, require: true },
});

export default mongoose.model(modelName, Schema);
