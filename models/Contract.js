import mongoose from "mongoose";

const contractSchema = new mongoose.Schema({
        fullName: { type: String, required: true },
        email: { type: String, required: true },
        signature: { type: String, required: true },
        contract: { type: String, required: true },
        contractHtml: { type: String, required: true },
        contractHash: { type: String, required: true },
        date: { type: String, required: true },
        ipAddress: { type: String, required: true },
        time: { type: String, required: true },
    });
    
    const Contract = mongoose.model("Contract", contractSchema);
    
    export default Contract;