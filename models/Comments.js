import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema(
      {
            comment: { type: String  , required:true},
            owner: { type: String, ref: "users", index: true , required:true},
            likes:[{
                type:mongoose.Schema.Types.ObjectId , ref:'users'
            }],
            // comments:[{
            //     type:mongoose.Schema.Types.ObjectId , ref:'Comments'
            // }]
      }
);

const CommentModel = mongoose.model("Comments", CommentSchema);

export default CommentModel;
