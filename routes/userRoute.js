import express from 'express';
import { isActiveUser } from '../middlewares/isActiveUser.js';
import validate from '../utils/yupValidations.js';
import controller from '../controllers/userController.js';
import trimRequest from 'trim-request';

import schemas from '../validations/userValidations.js';

const router = express.Router();

 router
  .route('/')
  .get(
    trimRequest.all,
    isActiveUser,
    controller.getUserInfo
  );

  router
  .route('/post')
  .post(trimRequest.all,isActiveUser, validate(schemas.postSchema), controller.newPost);

  router
  .route('/getPosts')
  .get(trimRequest.all,isActiveUser, controller.getPost);

  router
  .route('/likePost')
  .post(trimRequest.all,isActiveUser, validate(schemas.likeSchema) ,  controller.likePost);
  
  router
  .route('/newComment')
  .post(trimRequest.all,isActiveUser, validate(schemas.newCommentSchema) ,  controller.newComment);
  
  router
  .route('/likeComment')
  .post(trimRequest.all,isActiveUser, validate(schemas.likeCommentSchema) ,  controller.likeComment);





export default router;
