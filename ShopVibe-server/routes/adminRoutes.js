import express from 'express';
import { adminAuth, authorize } from '../middleware/adminAuth.js';
import {
    adminLogin,
    adminLogout,
    checkAdminAuth,
    getDashboardStats,
    getCloudinarySignature,
    getAllProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    getAllOrders,
    createOrder,
    updateOrder,
    deleteOrder,
    getAllUsers,
    createUser,
    updateUser,
    deleteUser,
    getAllAds,
    createAd,
    updateAd,
    deleteAd,
    getAllAdmins,
    createAdmin,
    updateAdmin,
    deleteAdmin
} from '../controllers/adminController.js';

const router = express.Router();


router.post('/auth/login', adminLogin);
router.post('/auth/logout', adminLogout);


router.use(adminAuth);

router.get('/auth/check', checkAdminAuth);
router.get('/stats', getDashboardStats); 
router.get('/upload-signature', authorize('SUPER_ADMIN', 'PRODUCT_ADMIN'), getCloudinarySignature);


router.get('/products', authorize('SUPER_ADMIN', 'PRODUCT_ADMIN', 'SUPPORT_ADMIN'), getAllProducts);

router.post('/products', authorize('SUPER_ADMIN', 'PRODUCT_ADMIN'), createProduct);
router.put('/products/:id', authorize('SUPER_ADMIN', 'PRODUCT_ADMIN'), updateProduct);
router.delete('/products/:id', authorize('SUPER_ADMIN', 'PRODUCT_ADMIN'), deleteProduct);



router.get('/orders', authorize('SUPER_ADMIN', 'ORDER_ADMIN', 'SUPPORT_ADMIN'), getAllOrders);

router.put('/orders/:id/status', authorize('SUPER_ADMIN', 'ORDER_ADMIN'), updateOrder);
router.put('/orders/:id', authorize('SUPER_ADMIN', 'ORDER_ADMIN'), updateOrder);

router.post('/orders', authorize('SUPER_ADMIN', 'ORDER_ADMIN'), createOrder);
router.delete('/orders/:id', authorize('SUPER_ADMIN', 'ORDER_ADMIN'), deleteOrder);


router.get('/users', authorize('SUPER_ADMIN', 'SUPPORT_ADMIN'), getAllUsers);

router.post('/users', authorize('SUPER_ADMIN'), createUser);
router.put('/users/:id', authorize('SUPER_ADMIN'), updateUser);
router.delete('/users/:id', authorize('SUPER_ADMIN'), deleteUser);


router.get('/ads', authorize('SUPER_ADMIN'), getAllAds);
router.post('/ads', authorize('SUPER_ADMIN'), createAd);
router.put('/ads/:id', authorize('SUPER_ADMIN'), updateAd);
router.delete('/ads/:id', authorize('SUPER_ADMIN'), deleteAd);

router.get('/admins', authorize('SUPER_ADMIN'), getAllAdmins);
router.post('/admins', authorize('SUPER_ADMIN'), createAdmin);
router.put('/admins/:id', authorize('SUPER_ADMIN'), updateAdmin);
router.delete('/admins/:id', authorize('SUPER_ADMIN'), deleteAdmin);

export default router;
