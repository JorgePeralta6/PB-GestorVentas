import Role from '../role/role.model.js';
import User from '../users/user.model.js';
import Category from '../categorys/category.model.js';
import Product from '../products/product.model.js';
import Carrito from '../cart/cart.model.js';
import Factura from '../factura/factura.model.js'

export const esRoleValido = async (role = '') => {

    const existeRol = await Role.findOne({ role });

    if(!existeRol){
        throw new Error(`El rol ${ role } no existe en la base de datos`);
    }
}

export const existenteEmail = async (correo = ' ') => {

    const existeEmail = await User.findOne({ correo });

    if(existeEmail){
        throw new Error(`El correo ${ correo } ya existe en la base de datos`);
    }
}

export const existeUsuarioById = async (id = '') => {
    const existeUsuario = await User.findById(id);
    
    if (!existeUsuario) {
        throw new Error(`El ID ${id} no existe`);
    }
}

export const existeCategory = async (id = '') => {
    const existeCategory = await Category.findById(id);
    
    if(!existeCategory){
        throw new Error(`La categoria con el ID ${id} no existe`)
    }
}

export const existeProduct = async (id = '') => {
    const existeProduct = await Product.findById(id);
    
    if(!existeProduct){
        throw new Error(`El producto con el ID ${id} no existe`)
    }
}

export const existeCarrito = async (id = '') => {
    const existeCarrito = await Carrito.findById(id);
    
    if(existeCarrito){
        throw new Error(`El carrito con el ID ${id} no existe`)
    }
}

export const existeFactura = async (id = '') => {
    const existeFactura = await Factura.findById(id);
    
    if(existeFactura){
        throw new Error(`La factura con el ID ${id} no existe`)
    }
}