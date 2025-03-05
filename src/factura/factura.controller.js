import Cart from '../cart/cart.model.js';
import Product from '../products/product.model.js';
import Factura from './factura.model.js';
import User from "../users/user.model.js"; 

export const saveFactura = async (req, res) => {
    try {
        const data = req.body;

        const user = await User.findOne({ name: data.name });
        if (!user) {
            return res.status(404).json({ 
                success: false,
                msg: "Usuario no encontrado" 
            })
        }

        const cart = await Cart.findOne({ user: user._id }).populate("products.product");
        if (!cart || cart.products.length === 0) {
            return res.status(400).json({ 
                success: false, 
                msg: "El carrito está vacío" 
            });
        }
        let total = 0;

        for (let item of cart.products) {
            if (item.product.stock < item.quantity) {
                return res.status(400).json({ 
                    success: false, 
                    msg: 'No hay suficiente stock' });
            }
            total += item.product.price * item.quantity;
        }

        const factura = new Factura({
            user: user._id,
            products: cart.products.map(item => ({
                product: item.product._id,
                quantity: item.quantity,
                price: item.product.price
            })),
            total
        })

        await factura.save();

        for (let item of cart.products) {
            await Product.findByIdAndUpdate(item.product._id, { 
                $inc: { stock: -item.quantity }
            });
        }

        for (let item of cart.products) {
            await Product.findByIdAndUpdate(item.product._id, { 
                $inc: { sold: +item.quantity }
            });
        }
        
        await Cart.findByIdAndUpdate(cart._id, { products: [] });

        return res.status(200).json({
            success: true,
            msg: "Compra realizada con éxito",
            factura
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

export const getFactura = async(req, res) => {
    try {
        const { limite = 10, desde = 0 } = req.query;
        const query = { status: true };
        const userAutentico = req.user.id;

        const factura = await Factura.find({ user: userAutentico })
            .skip(Number(desde))  // Paginación
            .limit(Number(limite)) 
            .populate({
                path: 'user',
                select: 'name , lastname'
            })
            .populate({
                path: 'products.product',
                select: 'nameP'
            });

        console.log(userAutentico)
        
        return res.status(200).json({
            success: true,
            msg: "Factura encontradas",
            factura
        })
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: "Error al obtener las factura",
            error: error.message
        })   
    }
}