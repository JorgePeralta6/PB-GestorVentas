import Cart from '../cart/cart.model.js';
import Product from '../products/product.model.js';
import Factura from './factura.model.js';
import User from "../users/user.model.js"; 

export const checkout = async (req, res) => {
    try {
        const data = req.body; // Aquí obtenemos todos los datos del body

        // Buscar el cliente por nombre
        const user = await User.findOne({ name: data.name });
        if (!user) {
            return res.status(404).json({ success: false, msg: "Usuario no encontrado" });
        }

        // Buscar el carrito del cliente
        const cart = await Cart.findOne({ user: user._id }).populate("products.product");
        if (!cart || cart.products.length === 0) {
            return res.status(400).json({ success: false, msg: "El carrito está vacío" });
        }

        let total = 0;

        // Verificar stock y calcular total
        for (let item of cart.products) {
            if (item.product.stock < item.quantity) {
                return res.status(400).json({ success: false, msg: `Stock insuficiente para ${item.product.nameP}` });
            }
            total += item.product.price * item.quantity;
        }

        // Crear factura
        const factura = new Factura({
            user: user._id, // Se usa el ID del cliente
            products: cart.products.map(item => ({
                product: item.product._id,
                quantity: item.quantity,
                price: item.product.price
            })),
            total
        });

        await factura.save();

        // Restar el stock de los productos comprados
        for (let item of cart.products) {
            await Product.findByIdAndUpdate(item.product._id, { 
                $inc: { stock: -item.quantity }  // Resta la cantidad comprada
            });
        }

        // Vaciar el carrito después de la compra
        await Cart.findByIdAndUpdate(cart._id, { products: [] });

        return res.status(200).json({
            success: true,
            msg: "Compra realizada con éxito",
            factura // Cambié `invoice` a `factura` para que coincida con el nombre
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            msg: "Error al procesar la compra",
            error: error.message
        });
    }
};
