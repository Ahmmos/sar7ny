import { model, Schema } from "mongoose";


const schema = new Schema({
    messege: {
        type: String,
        minlength: 4,
        maxlength: 500,
        required: true
    },

    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true, versionKey: false });

export const Messege = model("Messege", schema)