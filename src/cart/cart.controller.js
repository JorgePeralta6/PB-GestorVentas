import Cart from './cart.model.js'
import Product from '../products/product.model.js'
import User from '../users/user.model.js'

export const saveCart = async (req, res) => {
    try {
        const data = req.body; 


        const user = await User.findOne({ name: data.name });
        if (!user) {
            return res.status(404).json({ 
                success: false,
                msg: 'Usuario no encontrado' 
            });
        }

        let cart = await Cart.findOne({ user: user._id });
        if (!cart) {
            cart = new Cart({ user: user._id, products: [] });
        }

        for (let i = 0; i < data.products.length; i++) {
            const productData = data.products[i];

            const product = await Product.findOne({ nameP: productData.nameP });
            if (!product) {
                return res.status(404).json({
                    success: false,
                    msg: 'Producto no encontrado'
                });
            }

            if (productData.quantity > product.stock) {
                return res.status(400).json({
                    success: false,
                    msg: 'No hay suficiente stock'
                });
            }

            const productIndex = cart.products.findIndex(item => item.product.toString() === product._id.toString());

            if (productIndex !== -1) {
                const newQuantity = cart.products[productIndex].quantity + productData.quantity;
                if (newQuantity > product.stock) {
                    return res.status(400).json({
                        success: false,
                        msg: 'No hay suficiente stock'
                    });
                }
                cart.products[productIndex].quantity = newQuantity;
            } else {
                cart.products.push({ product: product._id, quantity: productData.quantity });
            }
        }

        await cart.save();

        return res.status(200).json({
            success: true,
            msg: 'Productos agregados al carrito con éxito',
            cart
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            msg: 'Error al agregar productos al carrito',
            error: error.message
        });
    }
};



export const getCart = async (req, res) => {
    try {
        const { limite = 10, desde = 0 } = req.query;

        const [total, carts] = await Promise.all([
            Cart.countDocuments(),
            Cart.find()
                .populate('user', 'name email')
                .populate('products.product', 'nameP price')
                .skip(Number(desde))
                .limit(Number(limite))
        ]);

        return res.status(200).json({
            success: true,
            msg: "Lista de carritos",
            total,
            carts
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            msg: "Error al obtener la lista de carritos"
        });
    }
};



export const updateCart = async (req, res) => {
    try {
        const { cartId, productId, quantity } = req.body;

        let cart = await Cart.findById(cartId);
        if (!cart) {
            return res.status(404).json({ success: false, msg: 'Carrito no encontrado' });
        }

        const productAdd = cart.products.findIndex(item => item.product.toString() === productId);

        if (productAdd === -1) {
            return res.status(404).json({ 
                success: false, 
                msg: 'Producto no encontrado en el carrito' });
        }

        if (quantity <= 0) {
            cart.products.splice(productAdd, 1);
        } else {
            const product = await Product.findById(productId);
            if (!product) {
                return res.status(404).json({ 
                    success: false, 
                    msg: 'Producto no encontrado' });
            }
            if (product.stock < quantity) {
                return res.status(400).json({ 
                    success: false, 
                    msg: 'No hay suficiente stock' });
            }

            cart.products[productAdd].quantity = quantity;
        }

        await cart.save();

        return res.status(200).json({
            success: true,
            msg: 'Carrito actualizado con éxito',
            cart
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            msg: 'Error al actualizar el carrito'
        });
    }
};