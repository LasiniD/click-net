import express from 'express';
import { adminAuth } from '../middleware/adminAuth.middleware.js';
import {
    getStats,
    getUsers,
    deleteUser,
    getPosts,
    deletePost,
    getComments,
    deleteComment
} from '../controllers/admin.controller.js';

const router = express.Router();

router.get('/stats', adminAuth, getStats);
router.get('/users', adminAuth, getUsers);
router.delete('/users/:id', adminAuth, deleteUser);
router.get('/posts', adminAuth, getPosts);
router.delete('/posts/:id', adminAuth, deletePost);
router.get('/comments', adminAuth, getComments);
router.delete('/post/:postId/comment/:commentId', adminAuth, deleteComment);


export default router;