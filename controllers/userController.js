import httpStatus from "http-status";
import logger from "../config/logger.js";
import PostModel from "../models/Post.js";
import { getUserFromId } from "../services/userService.js";
import ApiError from "../utils/APIError.js";
import mongoose from "mongoose";
import CommentModel from "../models/Comments.js";

const getUserInfo = async (req, res, next) => {
      const userId = req.authData.userId;
      try {
            const user = await getUserFromId(userId);
            const responseUser = {
                  id: user._id,
                  email: user.email,
            };
            res.json({ user: responseUser });
      } catch (error) {
            next(error);
      }
};
const newPost = async (req, res, next) => {
      const userId = req.authData.userId;
      try {
            let { title, body } = req.body;
            let new_post = await PostModel.insertMany(
                  {
                        body,
                        title,
                        owner: userId,
                  },
                  {}
            );
            logger.info("newPost =>", new_post);

            res.json({ status: true });
      } catch (error) {
            next(error);
      }
};

const getPost = async (req, res, next) => {
      const userId = req.authData.userId;
      try {
            // let { title , body } = req.body
            try {
                
                let posts = await PostModel.find().populate('likes')
                console.log('=====' , posts);

                // let posts = await PostModel.find().populate('comments').populate('comments',{
                //     path:'likes',
                //     model:'users'
                // });
                // console.log('======= ' , posts.map(item=>item.comments));
            } catch (error) {
                console.log('errrrrrrrrr' , error);
            }
            try {
                  let posts1 = await PostModel.aggregate([
                        {
                              $lookup: {
                                    from: "users",
                                    localField: "likes",
                                    foreignField: "_id",
                                    as: "likes",
                              }
                        },
                        {
                              $lookup: {
                                    from: "comments",
                                    localField: "comments",
                                    foreignField: "_id",
                                    as: "comments",
                              }
                        },
                        {
                              $lookup: {
                                    from: "users",
                                    foreignField: "_id",
                                    localField: {"$getField": "comments.likes"},
                                    as: "comments.likes2",
                              }
                        },
                        // {

                        // }
                        // {
                        //     $unwind:'$user_likes'
                        // },
                        {
                              $project: {
                                    title: 1,
                                    body: 1,
                                    owner: 1,
                                    comments: 1,
                                    "likes.email": 1,
                                    totalLikes: { $size: "$likes" },
                                    "comments": 1,
                                    "comments.likes2":1
                              },
                        },
                  ]);
                  console.log(posts1);
                  res.json({ posts: posts1 });
            } catch (error) {
                  console.log(error);
                  throw new ApiError(httpStatus.BAD_REQUEST, "Unable to fetch latest posts");
            }
      } catch (error) {
            next(error);
      }
};

const likePost = async (req, res, next) => {
      const userId = req.authData.userId;
      try {
            let { postId } = req.body;
            let post = await PostModel.find({
                  _id: postId,
                  // comments:{
                  //     _id:userId
                  // }
            });
            let isLiked = await PostModel.find({
                  _id: postId,
                  likes: {
                        $elemMatch: {
                              $eq: userId,
                        },
                  },
                  // comments:{
                  //     _id:userId
                  // }
            });
            console.log("liked", isLiked);

            // console.log('like post ' , post);
            // logger.info("post ", post);
            if (post) {
                  let query;

                  if (isLiked.length > 0) {
                        query = {
                              $pull: {
                                    likes: userId,
                              },
                        };
                  } else {
                        query = {
                              $push: {
                                    likes: userId,
                              },
                        };
                  }
                  let result = await PostModel.updateOne(
                        {
                              _id: postId,
                        },
                        query,
                        {
                              returnDocument: true,
                        }
                  );

                  logger.info("updated", result);
                  res.json({ post: result });
            } else {
                  throw new ApiError(httpStatus.BAD_REQUEST, "Post not found");
            }

            // res.json({ post });
      } catch (error) {
            console.log("errr", error);
            next(error);
      }
};



const newComment = async (req, res, next) => {
      const userId = req.authData.userId;
      try {
            let { postId, comment } = req.body;

            let post = await PostModel.find({
                  _id: postId,
            });

            if (post) {
                  // await PostModel.updateOne({
                  //       _id: postId,
                  // },{
                  //     $push:{
                  //         comments
                  //     }
                  // });
                  let res_comment = await CommentModel.insertMany(
                        {
                              comment: comment,
                              owner: userId,
                        },
                        {
                              rawResult: true,
                        }
                  );
                  console.log("resssss", res_comment.insertedIds);
                  let updatedPost = await PostModel.updateOne(
                        {
                              _id: postId,
                        },
                        {
                              $push: {
                                    comments: res_comment.insertedIds[0],
                              },
                        }
                  );
                  console.log("updatedddd", updatedPost);

                  res.json({ status: true });
            } else {
                  throw new ApiError(httpStatus.BAD_REQUEST, "Post not found");
            }
      } catch (error) {
            console.log(error);
            next(error);
      }
};

const likeComment = async (req, res, next) => {
    const userId = req.authData.userId;
    try {
          let {  commentId } = req.body;
          let post = await CommentModel.find({
                _id: commentId,
                // comments:{
                //     _id:userId
                // }
          });
          

          // console.log('like post ' , post);
          // logger.info("post ", post);
          if (post) {
            let isLiked = await CommentModel.find({
                _id:commentId,
                likes:{
                    $elemMatch:{
                        $eq:userId
                    }
                }
          })
          console.log("liked", isLiked);
                let query;

                if (isLiked.length > 0) {
                      query = {
                            $pull: {
                                  likes: userId,
                            },
                      };
                } else {
                      query = {
                            $push: {
                                  likes: userId,
                            },
                      };
                }
                let result = await CommentModel.updateOne(
                      {
                            _id: commentId,
                      },
                      query,
                      {
                            returnDocument: true,
                      }
                );

                logger.info("updated", result);
                res.json({ post: result });
          } else {
                throw new ApiError(httpStatus.BAD_REQUEST, "Post not found");
          }

          // res.json({ post });
    } catch (error) {
          console.log("errr", error);
          next(error);
    }
};

export default {
      getUserInfo,
      newPost,
      getPost,
      likePost,
      newComment,
      likeComment
};
