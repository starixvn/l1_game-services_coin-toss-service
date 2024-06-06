import mongoose from "mongoose";
import { ResultSchema } from "sc-game-base/src/core/models";
export default mongoose.model("cointoss_results", ResultSchema);
