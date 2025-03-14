'use strict';

import mongoose from "mongoose";
import Category from "../src/categorys/category.model.js"

export const dbConnection = async () => {
    try{
        mongoose.connection.on('error', ()=>{
            console.log('MongoDB | Could not be connected to MongoDB');
            mongoose.disconnect();
        });
        mongoose.connection.on('connecting', ()=>{
            console.log('MongoDB | Try connecting');
        });
        mongoose.connection.on('connected', ()=>{
            console.log('MongoDB | connected to MongoDB');
        });
        mongoose.connection.on('open', ()=>{
            console.log('MongoDB | connected to database');
        });
        mongoose.connection.on('reconnected', ()=>{
            console.log('MongoDB | reconnected to MongoDB');
        });
        mongoose.connection.on('disconnected', ()=>{
            console.log('MongoDB | disconnected');
        });
        mongoose.connect(process.env.URI_MONGO, {
            serverSelectionTimeoutMS: 5000,
            maxPoolSize: 50,
        });
    }catch(error){
        console.log('Database connection failed', error);
    }
}

export const createCategoria = async() => {
    try {
        const categoriaExists = await Category.findOne({name: "Condimentos"});

        if(!categoriaExists){
            const categoriaDefault = new Category({
                name: "Condimentos"
            });

            await categoriaDefault.save();
            console.log("Categoria creada con exito");
        }else{
            console.log(`Categoria ya existente`)
        }
    } catch (error) {
        console.log("Error al crear la categoria")
    }
}