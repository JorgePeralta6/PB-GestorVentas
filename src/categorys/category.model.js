import { Schema, model } from "mongoose";

const categorySchema = Schema ({
    name: {
        type: String,
        required: [true, 'Name is required'],
    },
    status:{
        type: Boolean,
        default: true
    }
});

export default model('Category', categorySchema);