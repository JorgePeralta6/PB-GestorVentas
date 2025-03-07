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
                cart.products[productIndex].quantity = productData.quantity;
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
        const { name, products } = req.body;

        console.log("Nombre del usuario:", name); 
        // Buscar al usuario por nombre
        const user = await User.findOne({ name });
        if (!user) {
            return res.status(404).json({ success: false, msg: 'Usuario no encontrado' });
        }

        let cart = await Cart.findOne({ user: user._id });
        if (!cart) {
            return res.status(404).json({ success: false, msg: 'Carrito no encontrado' });
        }

        for (let i = 0; i < products.length; i++) {
            const productData = products[i];
            console.log("Procesando producto:", productData);

            // Buscar el producto por nombre
            const product = await Product.findOne({ nameP: productData.nameP });
            if (!product) {
                return res.status(404).json({
                    success: false,
                    msg: `Producto ${productData.nameP} no encontrado`
                });
            }

            const productIndex = cart.products.findIndex(item => item.product.toString() === product._id.toString());

            if (productIndex === -1) {
                return res.status(404).json({
                    success: false,
                    msg: `Producto ${productData.nameP} no encontrado en el carrito`
                });
            }

            if (productData.quantity <= 0) {
                cart.products.splice(productIndex, 1);
            } else {
                if (product.stock < productData.quantity) {
                    return res.status(400).json({
                        success: false,
                        msg: `No hay suficiente stock para ${productData.nameP}`
                    });
                }
                cart.products[productIndex].quantity = productData.quantity;
            }
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
            msg: 'Error al actualizar el carrito',
            error: error.message
        });
    }
};

export const deleteProincart = async (req, res) => {
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
            return res.status(404).json({
                success: false,
                msg: 'Carrito no encontrado'
            });
        }

        // Busca el producto por el nombre
        const product = await Product.findOne({ nameP: data.nameP });
        if (!product) {
            return res.status(404).json({
                success: false,
                msg: 'Producto no encontrado'
            });
        }

        // Busca el producto en el carrito
        const productIndex = cart.products.findIndex(item => item.product.toString() === product._id.toString());

        if (productIndex === -1) {
            return res.status(404).json({
                success: false,
                msg: 'Producto no encontrado en el carrito'
            });
        }

        // Elimina el producto del carrito
        cart.products.splice(productIndex, 1);

        // Guarda el carrito actualizado
        await cart.save();

        return res.status(200).json({
            success: true,
            msg: 'Producto eliminado del carrito con éxito',
            cart
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            msg: 'Error al eliminar producto del carrito',
            error: error.message
        });
    }
};
