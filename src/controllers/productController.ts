import {Request, Response} from 'express';
import { productModel } from '../models/productModel';
import {connectToDatabase, disconnectFromDatabase} from '../repository/database';

// (CRUD)
/**
 * Create a new product in the data source based on the request body
 * @param req 
 * @param res 
 */
export async function createProduct(req: Request, res: Response): Promise<void> {
    
    const data = req.body;

    try {
        await connectToDatabase();

        const product = new productModel(data);
        await product.save();

        res.status(201).send(product);

    } catch (error) {
        res.status(500).send("Error creating product: " + error);
    } finally {
        await disconnectFromDatabase();
    }
}

/**
 * Retrieve all products from the data source
 * @param req 
 * @param res 
 */
export async function getAllProducts(req: Request, res: Response) {

    try {
        await connectToDatabase();

        const result = await productModel.find({});

        res.status(200).send(result);

    } catch (error) {
        res.status(500).send("Error retrieving product: " + error);
    } finally {
        await disconnectFromDatabase();
    }
}

/**
 * Retrieve a product by id
 * @param req 
 * @param res 
 */
export async function getProductById(req: Request, res: Response) {

    try {
        await connectToDatabase();

        const id = req.params.id;
        const result = await productModel.find({_id: id});

        res.status(200).send(result);

    } catch (error) {
        res.status(500).send("Error retrieving product: " + error);
    } finally {
        await disconnectFromDatabase();
    }
}

/**
 * Update a product by id
 * @param req 
 * @param res 
 */
export async function updateProductById(req: Request, res: Response) {

    const id = req.params.id;
    try {
        await connectToDatabase();

        const result = await productModel.findByIdAndUpdate(id, req.body);
        if (!result) {
            res.status(404).send('Product with id ' + id + ' not found');
        }
        else {
            res.status(200).send("Product updated successfully");
        }

    } catch (error) {
        res.status(500).send("Error updating product by id: " + error);
    } finally {
        await disconnectFromDatabase();
    }
}

/**
 * Delete a product by id
 * @param req 
 * @param res 
 */
export async function deleteProductById(req: Request, res: Response) {

    const id = req.params.id;
    try {
        await connectToDatabase();

        const result = await productModel.findByIdAndDelete(id);
        if (!result) {
            res.status(404).send('Product with id ' + id + ' not found');
        }
        else {
            res.status(200).send("Product deleted successfully");
        }

    } catch (error) {
        res.status(500).send("Error deleting product by id: " + error);
    } finally {
        await disconnectFromDatabase();
    }
}
