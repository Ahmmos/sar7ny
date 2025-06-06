import { model, Schema } from "mongoose";


const schema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    resetPasswordToken: {
        type: String
    },
    resetPasswordExpires: {
        type: Date
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true, versionKey: false });

export const User = model("User", schema)