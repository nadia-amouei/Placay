"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkAuth = void 0;
const checkAuth = (req, res) => {
    const user = req.user;
    res.status(200).json({
        user: {
            id_: user.id_,
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
            profileImage: user.profileImage,
            favorites: user.favorites,
            likedTours: user.likedTours,
        },
    });
};
exports.checkAuth = checkAuth;
