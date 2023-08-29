import yup from 'yup';

const schemas = {
  profileSchema: yup.object({
    access: yup.object({
      userId: yup.string().required(),
    }),
  }),
  postSchema:yup.object({
    body:yup.object({
      title:yup.string().required(),
      body:yup.string().required()
    })
  }),
  likeSchema:yup.object({
    body:yup.object({
      postId:yup.string().required()
    })
  }),
  newCommentSchema:yup.object({
    body:yup.object({
      postId:yup.string().required(),
      comment:yup.string().required(),
    })
  }),
  likeCommentSchema:yup.object({
    body:yup.object({
      commentId:yup.string().required(),
    })
  }),
};

export default schemas;
