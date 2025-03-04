import { Schema, model } from "mongoose";

const productSchema = Schema({
    nameP: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
        min: [0, 'El precio no puede valer - que 0']
    },
    description: {
        type: String,
        required: true
    },
    stock: {
        type: Number,
        required: true,
        min: [0, 'No puede haber menos que 0 stocks']
    },
    sold: {
        type: Number,
        required: true
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    status: {
        type: Boolean,
        default: true,
    },
});

export default model('Product', productSchema);