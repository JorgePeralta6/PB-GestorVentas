import { response } from "express";
import Category from '../categorys/category.model.js';
import Product from './product.model.js'

export const saveProduct = async (req, res) => {
    try {

        const data = req.body;

        const category = await Category.findOne({ name: data.name });

        if (!category) {
            return res.status(404).json({
                succes: false,
                message: 'Categoria no encontrada',
                error: error.message
            })
        }

        const product = new Product({
            ...data,
            category: category._id
        });

        await product.save();

        res.status(200).json({
            succes: true,
            product
        });

    } catch (error) {
        res.status(500).json({
            succes: false,
            msg: 'Error al crear el producto',
            error: error.message
        })
    }
}

export const getProduct = async (req, res) => {
    const { limite = 10, desde = 0 } = req.query;
    const query = { status: true };

    try {

        const [total, product] = await Promise.all([
            Product.countDocuments(query),
            Product.find(query)
                .populate({ path: 'category', match: { status: true }, select: 'name' })
                .skip(Number(desde))
                .limit(Number(limite))
        ])

        res.status(200).json({
            succes: true,
            total,
            product
        })
    } catch (error) {
        res.status(500).json({
            succes: false,
            msg: 'Error al obtener el producto',
            error: error.message
        })
    }
}

export const deleteProduct = async (req, res) => {

    const { id } = req.params;

    try {

        await Product.findByIdAndUpdate(id, { status: false });

        res.status(200).json({
            success: true,
            msg: 'Producto eliminado exitosamente'
        });
    } catch (error) {
        console.log("hola")
        res.status(500).json({
            success: false,
            msg: 'Error al eliminar producto',
            error
        })
    }
}


export const updateProduct = async (req, res = response) => {
    try {
        const { id } = req.params;
        const { _id, ...data } = req.body;

        const product = await Product.findByIdAndUpdate(id, data, { new: true });

        res.status(200).json({
            succes: true,
            msg: 'Producto actualizada exitosamente',
            product
        })

    } catch (error) {
        res.status(500).json({
            succes: false,
            msg: "Error al actualizar el producto",
            error: error.message
        })
    }
} 