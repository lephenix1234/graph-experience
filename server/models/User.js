import mongoose from "mongoose";
import md5 from "md5";
import bcrypt from "bcrypt"

const Schema = mongoose.Schema

const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    avatar: {
        type: String
    },
    joinDate: {
        type: Date,
        default: Date.now()
    },
    favorites: {
        type: [mongoose.Schema.Types.ObjectId],
        required: true,
        ref: "Post"
    }
})


UserSchema.pre("save", function (next) {
    this.avatar = `http://gravatar.com/avatar/${md5(this.username)}?d=identicon`
    next()
})

UserSchema.pre("save", function (next) {
    if (!this.isModified()) {
        return next()
    }

    bcrypt.genSalt(10, (err, salt) => {
        if (err) return next(err)
        bcrypt.hash(this.password, salt, (err, hash) => {
            if (err) return next(err)

            this.password = hash;
            next()
        })
    })
})

export default mongoose.model("User", UserSchema)