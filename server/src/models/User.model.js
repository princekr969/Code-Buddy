import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: function() {
            return !this.googleId && !this.githubId;
        },
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: function() {
            return !this.googleId && !this.githubId;
        },
        minlength: 6,
    },
    
    googleId: {
        type: String,
        unique: true,
        sparse: true, 
    },

    avatar: {
        type: String,
        default: '',
    },
    
    
    providers: [{
        provider: {
            type: String,
            enum: ['local', 'google', 'github'],
        },
        providerId: String,
        linkedAt: {
            type: Date,
            default: Date.now,
        },
    }],
    
    isEmailVerified: {
        type: Boolean,
        default: false,
    },

    lastLoginProvider: {
        type: String,
        enum: ['local', 'google', 'github'],
    },
    
    refreshToken: {
        type: String,
        select: false,
    },
    
    emailVerificationToken: String,
    emailVerificationExpires: Date,
    
    passwordResetToken: String,
    passwordResetExpires: Date,
}, {
    timestamps: true,
});

export default mongoose.model('User', userSchema);