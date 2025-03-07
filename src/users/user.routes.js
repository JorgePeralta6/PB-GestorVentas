import { Router } from "express";
import { check } from "express-validator";
import { getUsers, getUserById, updateUser, deleteUser, updatePassword } from "./user.controller.js"
import { existeUsuarioById } from "../helpers/db-validator.js"
import { validarCampos } from "../middlewares/validar-campos.js";
import { validarJWT } from "../middlewares/validar-jwt.js"; 
import { soloAdmin, eliminadoPropio, editadoPropio } from "../middlewares/validar-roles.js";

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
        editadoPropio,
        validarCampos
    ],
    updateUser
)

router.delete(
    "/:id",
    [
        validarJWT,
        eliminadoPropio,
        validarCampos
    ],
    deleteUser
)

router.put(
    "/newpassword/:id",
    [
        validarJWT,
        editadoPropio,
        validarCampos
    ],
    updatePassword
)

export default router;