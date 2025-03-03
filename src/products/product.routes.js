import { Router } from "express";
import { check } from "express-validator";
import { saveProduct, getProduct, deleteProduct, updateProduct, getProductById } from "./product.controller.js";
import { getStockA, buscarPorNombre } from "./product.controller.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { existeProduct } from "../helpers/db-validator.js";
import { validarJWT } from "../middlewares/validar-jwt.js";
import { soloAdmin } from "../middlewares/validar-roles.js";

const router = Router();

router.post(
    "/",
    [
        validarJWT,
        soloAdmin,
        validarCampos
    ],
    saveProduct
)

router.get("/", getProduct)

router.delete(
    "/:id",
    [
        validarJWT,
        soloAdmin,
        check("id").custom(existeProduct),
        validarCampos
    ],
    deleteProduct
)

router.put(
    "/:id",
    [
        validarJWT,
        soloAdmin,
        check("id").custom(existeProduct),
        validarCampos
    ],
    updateProduct
)

router.get(
    "/findProduct/:id",
    [
        check("id").custom(existeProduct),
        validarCampos
    ],
    getProductById
)

router.get(
    "/stock",
    [
        check("id").custom(existeProduct),
    ],
    getStockA
)

router.get(
    "/buscar",
    buscarPorNombre
)
export default router;