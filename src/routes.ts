import { Router, Request, Response } from 'express';
import { 
    createProduct, 
    getAllProducts, 
    getProductById, 
    updateProductById,
    deleteProductById 
} from './controllers/productController';

import { 
    registerUser,
    loginUser,
    verifyToken
} from './controllers/authController';
const router: Router = Router();


/**
 * 
 */
router.get('/', (req: Request, res: Response) => {
    // connect
    res.status(200).send('Welcome to the API');
    // disconnect
});

// Auth routes
router.post('/user/register', registerUser);
router.post('/user/login', loginUser);


// Product routes
router.post('/products', verifyToken, createProduct);
router.get('/products', getAllProducts);
router.get('/products/:id', getProductById);
router.put('/products/:id', verifyToken, updateProductById);
router.delete('/products/:id', verifyToken, deleteProductById);
export default router;