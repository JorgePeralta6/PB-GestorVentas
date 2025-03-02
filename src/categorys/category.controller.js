import Category from "./category.model.js";

export const saveCategory = async(req, res) => {
    try{
        const data = req.body;

        const category = new Category({
            name: data.name,
        })

        await category.save();

        res.status(200).json({
            success: true,
            category
        })
    }catch(error){
        return res.status(500).json({
            success: false,
            msg: "Error al crear la category"
        })

    }
}

export const getCategory = async(req, res) => {
    try {
        const { limite = 10, desde = 0 } = req.query;
        const query = { status: true };

        const [total, categorys] = await Promise.all([
            Category.countDocuments(query),
            Category.find(query)
                .skip(Number(desde))
                .limit(Number(limite))
        ])

        return res.status(200).json({
            success: true,
            msg: "Category encontrada exitosamente",
            total,
            categorys
        })
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: "Error al obtener la category"
        })   
    }

}

export const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;

        const categoryToDelete = await Category.findById(id);
        if (!categoryToDelete) {
            return res.status(404).json({
                success: false,
                msg: "Categoría no encontrada"
            });
        }

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

export const updateCategory = async(req, res) => {
    try {
        const { id } = req.params;
        const { _id, name, ...data} = req.body;

        const category = await Category.findByIdAndUpdate(id, data, {new: true});

        category.name = name;
        await category.save(); 

        res.status(200).json({
            success: true,
            msg: "Category actualizada exitosamente",
            category
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "Error al actualizar la category",
            error: error.message || error
        })
    }
}