import mongoose from "mongoose";

const PostSchema = new mongoose.Schema(
      {
            title: { type: String },
            body: { type: String },
            owner: { type: String, ref: "users", index: true },
            likes:[{
                type:mongoose.Schema.Types.ObjectId , ref:'users'
            }],
            comments:[{
                type:mongoose.Schema.Types.ObjectId , ref:'Comments'
            }]
      }
);

const PostModel = mongoose.model("Post", PostSchema);

export default PostModel;
