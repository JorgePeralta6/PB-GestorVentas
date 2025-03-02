import { Router } from "express";
import { check } from "express-validator";
import { saveCategory, getCategory, updateCategory, deleteCategory } from "./category.controller.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { existeCategory } from "../helpers/db-validator.js";
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
    saveCategory
)

router.get("/", getCategory)

router.delete(
    "/:id",
    [
        validarJWT,
        soloAdmin,
        check("id").custom(existeCategory),
        validarCampos
    ],
    deleteCategory
)

router.put(
    "/:id",
    [
        validarJWT,
        soloAdmin,
        check("id").custom(existeCategory),
        validarCampos
    ],
    updateCategory
)

export default router;