import Cart from './cart.model.js'
import Product from '../products/product.model.js'
import User from '../users/user.model.js'

export const saveCart = async (req, res) => {
    try {
        const { userId, productId, quantity } = req.body;

        const cliente = await User.findById(userId); 
        if (!cliente) {
            return res.status(404).json({ success: false, msg: 'Usuario no encontrado' });
        }

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ success: false, msg: 'Producto no encontrado' });
        }
        if (product.stock < quantity) {
            return res.status(400).json({ success: false, msg: 'No hay suficiente stock' });
        }

        let cart = await Cart.findOne({ cliente: userId }); 

        if (!cart) {
            cart = new Cart({ cliente: userId, products: [] });
        }

        const productAdd = cart.products.findIndex(item => item.product.toString() === productId);

        if (productAdd !== -1) {
            cart.products[productAdd].quantity += quantity;
        } else {
            cart.products.push({ product: productId, quantity });
        }

        await cart.save();

        return res.status(200).json({
            success: true,
            msg: 'Producto agregado al carrito con éxito',
            cart
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            msg: 'Error al agregar producto al carrito',
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
                .populate('cliente', 'name email') 
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
            return res.status(404).json({ success: false, msg: 'Producto no encontrado en el carrito' });
        }

        if (quantity <= 0) {
            cart.products.splice(productAdd, 1);
        } else {
            const product = await Product.findById(productId);
            if (!product) {
                return res.status(404).json({ success: false, msg: 'Producto no encontrado' });
            }
            if (product.stock < quantity) {
                return res.status(400).json({ success: false, msg: 'No hay suficiente stock' });
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

export const deleteCart = async (req, res) => {
    try {
        const { cartId } = req.params;

        const cart = await Cart.findById(cartId);
        if (!cart) {
            return res.status(404).json({ success: false, msg: 'Carrito no encontrado' });
        }

        cart.status = false;
        await cart.save();

        return res.status(200).json({
            success: true,
            msg: 'Carrito desactivado con éxito',
            cart
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            msg: 'Error al desactivar el carrito'
        });
    }
};

export const deletePinCart = async (req, res) => {
    try {
        const { cartId, productId } = req.body;

        let cart = await Cart.findById(cartId);
        if (!cart) {
            return res.status(404).json({ success: false, msg: 'Carrito no encontrado' });
        }

        const newProducts = cart.products.filter(item => item.product.toString() !== productId);

        if (newProducts.length === cart.products.length) {
            return res.status(400).json({ success: false, msg: 'El producto no estaba en el carrito' });
        }

        cart.products = newProducts;
        await cart.save();

        return res.status(200).json({
            success: true,
            msg: 'Producto eliminado del carrito',
            cart
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            msg: 'Error al eliminar el producto del carrito'
        });
    }
};