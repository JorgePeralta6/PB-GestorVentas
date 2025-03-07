import User from "../users/user.model.js"

export const tieneRole = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(500).json({
                success: false,
                msg: 'Se quiere verificar un role sin validar el token primero'
            })
        }
        if (!roles.includes(req.user.role)) {
            return res.status(400).json({
                success: false,
                msg: `Usuario no autorizado, posee un rol ${req.user.role}, los roles autorizados son ${roles}`
            })
        }

        next();
    }
}

export const soloAdmin = async (req, res, next) => {
    try {
        const { id } = req.params;
        const authenticatedUserAdmin = req.user.role;
        
        if (authenticatedUserAdmin !== "ADMIN_ROLE") {
            return res.status(403).json({
                success: false,
                msg: "Solo el ADMIN puede crear y modificar"
            });
        }

        next();
    } catch (error) {
        return res.status(500).json({ 
            success: false,
            msg: "Error al modificar",
            error: error.message || error
        });
    }
};

export const soloCliente = async (req, res, next) => {
    try {
        const { id } = req.params;
        const authenticatedUserClient = req.user.role;
        
        if (authenticatedUserClient !== "CLIENT_ROLE") {
            return res.status(403).json({
                success: false,
                msg: "Solo el cliente"
            });
        }

        next();
    } catch (error) {
        return res.status(500).json({ 
            success: false,
            msg: "Error al modificar",
            error: error.message || error
        });
    }
};

export const eliminadoPropio = async(req, res, next) => {
    const { id } = req.params;
    const user = req.user.role;
    const yourUser = req.user.id;

    try {  
        if(user !== "ADMIN_ROLE" && yourUser !== id){
            return res.status(403).json({
                success: false,
                msg: "No puede eliminar otros usuarios que no sea el suyo"
            })
        }

        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: "Error en la validacion para eliminar"
        })
    }
}

export const editadoPropio = async(req, res, next) => {
    const { id } = req.params;
    const user = req.user.role;
    const yourUser = req.user.id;
    const { role } = req.body;

    try {
        if (role && user !== "ADMIN_ROLE") {
            return res.status(403).json({
                success: false,
                msg: "Solo los administradores pueden editar el role de otros usuarios"
            });
        }

        if(user !== "ADMIN_ROLE" && yourUser !== id){
            return res.status(403).json({
                success: false,
                msg: "Solo puede editar su propio usuario"
            });

        }

        next();

    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: "Error en la validacion de la actualizacion",
            error: error.message || error
        })
    }
}