import { Router } from "express";
import { saveFactura , getFactura } from "./factura.controller.js";
import { validarCampos } from "../middlewares/validar-campos.js";
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
    saveFactura
)

router.get("/", 
    [
        validarJWT,
        soloCliente
    ],
    getFactura)


export default router;