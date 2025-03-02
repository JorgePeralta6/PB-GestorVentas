import User from "../users/user.model.js"

export const tieneRole = (...roles) => {
    return (req, res, next) => {
        if (!req.usuario) {
            return res.status(500).json({
                success: false,
                msg: 'Se quiere verificar un role sin validar el token primero'
            })
        }
        if (!roles.includes(req.usuario.role)) {
            return res.status(400).json({
                success: false,
                msg: `Usuario no autorizado, posee un rol ${req.usuario.role}, los roles autorizados son ${roles}`
            })
        }

        next();
    }
}

export const soloAdmin = async(req, res, next) => {
    try {
        const {id} = req.params;
        const authenticatedUserAdmin = req.user.role;
        
        if(authenticatedUserAdmin !== "ADMIN_ROLE"){
            return res.status(403).json({
                success: false,
                msg: "Solo el ADMIN puede modificar una categoria"
            })
        }

        next()
    } catch (error) {
        return res.json(500).json({
            success: false,
            msg: "Error al modificar la categoria",
            error: error.message || error
        })
    }
}