import User from '../models/User.js';
import crypto from 'crypto';
import generateToken from '../utils/generateToken.js';
import { sendEmail } from '../utils/sendEmail.js';

export const registerUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: 'Vui lòng cung cấp đầy đủ thông tin' });
        }

        const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (!emailRegex.test(email)) {
             return res.status(400).json({ success: false, message: 'Email không hợp lệ' });
        }

        if (password.length < 6) {
            return res.status(400).json({ success: false, message: 'Mật khẩu phải có ít nhất 6 ký tự' });
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ success: false, message: 'Email đã được sử dụng' });
        }

        const user = await User.create({
            name,
            email,
            password,
            role: role || 'user'
        });

        const token = generateToken(user._id, user.role);

        res.status(201).json({
            success: true,
            token
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi server', error: error.message });
    }
};

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Vui lòng cung cấp email và mật khẩu' });
        }

        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(401).json({ success: false, message: 'Email hoặc mật khẩu không đúng' });
        }

        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Email hoặc mật khẩu không đúng' });
        }

        const token = generateToken(user._id, user.role);

        res.status(200).json({
            success: true,
            token,
            role: user.role,
            user: {
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi server', error: error.message });
    }
};

export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');

        if (!user) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy người dùng' });
        }

        res.status(200).json({
            success: true,
            data: {
                _id: user._id,
                name: user.name,
                email: user.email,
                avatar: user.avatar,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi server', error: error.message });
    }
};

export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ success: false, message: 'Vui lòng cung cấp email' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            // Trả về thành công ngay cả khi không tìm thấy để tránh email enumeration
            return res.status(200).json({ success: true, message: 'Nếu email tồn tại, link reset sẽ được gửi.' });
        }

        const resetToken = crypto.randomBytes(32).toString('hex');
        
        user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

        await user.save({ validateBeforeSave: false });

        const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
        
        const message = `
            <h2>Bạn đã yêu cầu đặt lại mật khẩu</h2>
            <p>Vui lòng click vào link bên dưới để đặt lại mật khẩu của bạn. Link này sẽ hết hạn trong 10 phút:</p>
            <a href="${resetUrl}" clicktracking="off">${resetUrl}</a>
            <p>Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email.</p>
        `;

        try {
            await sendEmail({
                to: user.email,
                subject: 'Đặt lại mật khẩu - Math Learning',
                html: message
            });

            res.status(200).json({
                success: true,
                message: 'Đã gửi link reset password về email'
            });
        } catch (error) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;
            await user.save({ validateBeforeSave: false });

            return res.status(500).json({ success: false, message: 'Không thể gửi email: ' + error.message });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi server: ' + error.message });
    }
};

export const resetPassword = async (req, res) => {
    try {
        const resetToken = req.params.token || req.body.token;
        const { password } = req.body;

        if (!resetToken || !password) {
            return res.status(400).json({ success: false, message: 'Vui lòng cung cấp token và mật khẩu mới' });
        }

        if (password.length < 6) {
            return res.status(400).json({ success: false, message: 'Mật khẩu mới phải có ít nhất 6 ký tự' });
        }

        const resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');

        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ success: false, message: 'Token không hợp lệ hoặc đã hết hạn' });
        }

        // Mật khẩu sẽ được xử lý bởi middleware pre-save trong User.js
        user.password = password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();

        res.status(200).json({
            success: true,
            message: 'Mật khẩu đã được đặt lại thành công'
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi server', error: error.message });
    }
};

export const getUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.status(200).json({
            success: true,
            data: users
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi server', error: error.message });
    }
};

export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, role, password } = req.body;
        
        let user = await User.findById(id);
        if(!user) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy tài khoản' });
        }

        if(name) user.name = name;
        if(email) user.email = email;
        if(role) user.role = role;
        if(password) user.password = password; 
        
        await user.save();
        res.status(200).json({ success: true, message: 'Cập nhật thành công', data: {
            _id: user._id, name: user.name, email: user.email, role: user.role
        }});
    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi server', error: error.message });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByIdAndDelete(id);
        
        if(!user) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy tài khoản' });
        }

        res.status(200).json({ success: true, message: 'Xoá tài khoản thành công' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi server', error: error.message });
    }
};
