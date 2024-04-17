const User = require('../models/userChema')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


// ----Search users-------
const searchUser = async (req, res) => {
    try {
        const { query } = req.query;
        const result = await User.find({
            $or: [
                { firstname: { $regex: query, $options: 'i' } },
                { lastname: { $regex: query, $options: 'i' } }
            ]
        })

        if (result.length === 0) {
            return res.json({ message: "No user found with the provided query" })
        }

        res.json({
            success: true,
            message: "Found person!",
            result
        })

    } catch (error) {
        res.json({
            success: false,
            error,
            message: "Servor error",
        });
    }

}

// ----Get users-------
const getData = async (req, res) => {
    try {
        const allData = await User.find();
        res.json({
            success: true,
            message: "Users Lists Fetched Successfully",
            data: allData,
        });
    } catch (error) {
        res.json({
            success: false,
            error,
            message: "Errro WHile Fetching User",
        });
    }

}

// ----Login sign In-------
const postLogin = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Username or password is invalid!",
            });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({
                success: false,
                message: "Username or password is invalid!",
            });
        }

        const token = jwt.sign({ username: user.username }, "secret");
        return res.status(200).json({
            success: true,
            message: "Sign in successful!",
            token: token
        });
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ success: false, message: "Server error: An error occurred during the login process." });
    }
};

// ---Register------
const createUser = async (req, res) => {
    try {
        const {
            username,
            password,
            firstname,
            lastname,
            address,
            phone,
            birthday,
        } = req.body;

        // Tekshirish
        const existingUser = await User.findOne({ username });

        // Agar foydalanuvchi mavjud bo'lsa
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "Bu nom bilan ro'yxatdan o'tgan foydalanuvchi mavjud."
            });
        } else {
            // Agar foydalanuvchi mavjud bo'lmasa, parolni hash qilish
            const hashedPassword = await bcrypt.hash(password, 10);

            // Yangi foydalanuvchini yaratish
            const newUser = new User({
                username,
                password: hashedPassword,
                firstname,
                lastname,
                address,
                phone,
                birthday,
            });

            // Yangi foydalanuvchini saqlash
            await newUser.save();

            // Muvaffaqiyatlik haqida habar qaytarish
            return res.status(201).json({
                success: true,
                message: "Ro'yxatdan o'tish muvaffaqiyatli yakunlandi."
            });
        }
    } catch (error) {
        // Xato holatida xabarnoma chiqarish va server xatosi qaytarish
        console.error("Xato:", error);
        return res.status(500).json({ success: false, message: "Server xatosi: Ro'yxatdan o'tish jarayonida xato yuz berdi." });
    }
};

//----Delete User---
const deleteUser = async (req, res) => {
    try {
        let { id } = req.body;
        let deleted = await User.findByIdAndDelete(id);

        if (!deleted) {
            return res.json({
                success: false,
                message: "User is not deleted!",
            })
        }
        res.json({
            success: true,
            message: "User is deleted!",
            innerData: deleted
        })
    } catch (error) {
        res.json({ success: false, message: error, })
    }
}

//----Update User---
const updateUser = async (req, res) => {
    try {
        let { id } = req.body;
        let body = req.body;

        let editUser = await User.updateMany({ _id: id }, body);

        if (!editUser) {
            return res.json({
                success: false,
                message: "User is not updated!",
            })
        }
        res.json({
            success: true,
            message: "User is updated!",
            innerData: editUser
        })

    } catch (error) {
        res.json({ success: false, message: error, })
    }
}


module.exports = {
    createUser,
    postLogin,
    getData,
    deleteUser,
    updateUser,
    searchUser
}