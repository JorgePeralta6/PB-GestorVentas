import { Schema, model } from "mongoose";

const cartSchema = Schema ({
    cliente: {
        type: Schema.Types.ObjectId,
        ref: 'user',  // Referencia al modelo de usuario
        required: true
    },
    products: [{
        product: {
            type: Schema.Types.ObjectId,
            ref: 'Product',  // Referencia al modelo de producto
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            min: [1, 'La cantidad debe ser al menos 1']
        }
    }]
})

export default model('Cart', cartSchema);