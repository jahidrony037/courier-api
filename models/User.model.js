import bcrypt from 'bcryptjs';
import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
    name: String, 
    email: {type: String, unique: true},
    password: String, 
    role:{ type: String, enum: ['admin', 'agent', 'customer'], default: 'customer' }
}, { timestamps: true });

userSchema.pre('save', async function (next) {
    if(!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

userSchema.methods.comparePassword = async function (inputPassword) {
    return bcrypt.compare(inputPassword, this.password);
}

export default mongoose.model('User', userSchema, "users");