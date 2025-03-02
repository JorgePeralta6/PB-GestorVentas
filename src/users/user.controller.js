import { response } from "express";
import { hash, verify } from "argon2";
import User from "./user.model.js";

export const getUsers = async (req = request, res = response) => {
    try {
        const { limite = 10, desde = 0 } = req.query;
        const query = { estado: true };

        const [total, users] = await Promise.all([
            User.countDocuments(query),
            User.find(query)
                .skip(Number(desde))
                .limit(Number(limite))
        ])

        res.status(200).json({
            sucess: true,
            total,
            users
        })
    } catch (error) {
        res.status(500).json({
            sucess: false,
            msg: 'Error al obtener usuarios',
            error
        })
    }
}

export const getUserById = async (req, res) => {
    try {

        const { id } = req.params;

        const user = await User.findById(id)

        if (!user) {
            return res.status(404).json({
                success: false,
                msg: 'Usuario no encontrado'
            })
        }

        res.status(200).json({
            success: true,
            user
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error al obtener usuarios',
            error
        })
    }
}

export const updateUser = async (req, res = response) => {
    try {
        const { id } = req.params
        const { _id, password, email, ...data } = req.body;

        if (password) {
            data.password = await hash(password)
        }

        const user = await User.findByIdAndUpdate(id, data, { new: true });

        res.status(200).json({
            success: true,
            msg: 'Usuario actualizado',
            user
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error al actualizar user',
            error
        })
    }
}

export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        await User.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            msg: "Categoría eliminada correctamente y publicaciones actualizadas"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "Error al eliminar la categoría",
            error: error.message || error
        });
    }
};
