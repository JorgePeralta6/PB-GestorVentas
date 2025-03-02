import { Router } from "express";
import { check } from "express-validator";
import { getUsers, getUserById, updateUser, deleteUser } from "./user.controller.js"
import { existeUsuarioById } from "../helpers/db-validator.js"
import { validarCampos } from "../middlewares/validar-campos.js";
import { validarJWT } from "../middlewares/validar-jwt.js"; 
import { soloAdmin } from "../middlewares/validar-roles.js";

const router = Router();

router.get("/", getUsers);

router.get(
    "/findUser/:id",
    [
        check("id", "No es un ID valido").isMongoId(),
        check("id").custom(existeUsuarioById),
        validarCampos
    ],
    getUserById
)

router.put(
    "/:id",
    [   
        validarJWT,
        soloAdmin,
        check("id").custom(existeUsuarioById),
        validarCampos
    ],
    updateUser
)

router.delete(
    "/:id",
    [
        validarJWT,
        soloAdmin,
        check("id").custom(existeUsuarioById),
        validarCampos
    ],
    deleteUser
)

export default router;