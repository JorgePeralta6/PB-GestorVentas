import { Router } from "express";
import { check } from "express-validator";
import { saveCart, getCart, updateCart, deleteProincart } from "./cart.controller.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { existeCarrito } from "../helpers/db-validator.js";
import { validarJWT } from "../middlewares/validar-jwt.js";
import { soloCliente } from "../middlewares/validar-roles.js";

const router = Router();

router.post(
    "/",
    [
        validarJWT,
        soloCliente,
        validarCampos
    ],
    saveCart
)

router.get("/",
    [
        validarJWT,
        soloCliente
    ],
    getCart
)

router.put(
    "/:id",
    [
        validarJWT,
        soloCliente,
        validarCampos
    ],
    updateCart
)

router.delete(
    "/:id",
    [
        validarJWT,
        soloCliente,
        validarCampos
    ],
    deleteProincart
)
export default router;