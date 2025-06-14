import User from "../../lib/models/User.js";
import { generateToken } from "../../utlis/GenerateAndVerfyToken.js";
import { hash } from "../../utlis/hashingAndCompare.js";
import nodemailer from "nodemailer";
export const authController = async (req, res) => {
  try {
    const { email, userName, password, imageProfile } = req.body;
    console.log(req.body);

    const existEmail = await User.findOne({ email });
    if (existEmail) {
      return res.status(400).json({
        message: "Email already exists",
        success: false,
      });
    }
    let profileImage = null;
    if (imageProfile && typeof imageProfile === "string") {
      profileImage = imageProfile;
    }

    const user = await User.create({
      email,
      userName,
      password,
      profileImage,
    });

    return res.status(201).json({
      message: "User created successfully",
      success: true,
      user: {
        id: user._id,
        userName: user.userName,
        email: user.email,
        profileImage: user.profileImage,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error.message,
    });
  }
};

export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(req.body);

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "Invalid email or password",
        success: false,
      });
    }
    const checkPassword = await user.comparePassword(password);
    
    if (!checkPassword) {
      return res.status(400).json({
        message: "Invalid email or password",
        success: false,
      });
    }

    // create token
    const token = generateToken({
      payload: {
        userId: user._id,
        userName: user.userName,
        email: user.email,
        profileImage: user.profileImage,
      },
    });

    return res.status(200).json({
      message: "Login successfully",
      success: true,
      token,
      user: {
        id: user._id,
        userName: user.userName,
        email: user.email,
        profileImage: user.profileImage,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error.message,
    });
  }
};

export const updateUserController = async (req, res) => {
  try {
    const { id } = req.params;
    const { email, userName, password, profileImage } = req.body;

    console.log(req.body);

    const updateData = {
      email,
      userName,
    };

    // Hash the password before updating
    if (password) {
      const hashedPassword = hash({
        plaintext: password,
        salt: process.env.SALT_ROUND,
      });
      updateData.password = hashedPassword;
    }

    if (profileImage && typeof profileImage === "string") {
      updateData.profileImage = profileImage;
    }

    const updatedUser = await User.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updatedUser) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }
    console.log("updatedUser", updatedUser);

    return res.status(200).json({
      message: "User updated successfully",
      success: true,
      user: {
        id: updatedUser._id,
        userName: updatedUser.userName,
        email: updatedUser.email,
        profileImage: updatedUser.profileImage,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error.message,
    });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email } = req.body;
 
    if (!email) {
      return res.status(400).json({ message: "Email is required." });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const resetToken = Math.random().toString(36).substring(2, 15);
    const tokenExpires = new Date(Date.now() + 30 * 60 * 1000);

    user.resetToken = resetToken;
    user.resetTokenExpires = tokenExpires;
    await user.save();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const resetLink = `http://localhost:5173/reset-password?token=${resetToken}`;

    const mailOptions = {
      from: `"SPOKIFY Support" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Reset your password",
      html: `
        <p>You've requested to reset your password.</p>
        <a href="${resetLink}">Click here to reset</a>
        <p>This link will expire in 30 minutes.</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Reset link sent successfully." });
  } catch (error) {
    console.error("Reset Password Error:", error);
    res.status(500).json({ message: "Something went wrong." });
  }
};

export const confirmResetPassword = async (req, res) => {
  try {
    const { resetToken, newPassword } = req.body;
    console.log("Reset Password Confirm Data:", req.body);

    if (!resetToken || !newPassword) {
      return res
        .status(400)
        .json({ message: "Token and new password are required." });
    }

    const user = await User.findOne({ resetToken });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token." });
    }

    if (user.resetTokenExpires < Date.now()) {
      return res.status(400).json({ message: "Token expired." });
    }

    const hashed = await hash({
      plaintext: newPassword,
    });

    user.password = hashed;

    user.resetToken = null;
    user.resetTokenExpires = null;

    await user.save();

    return res
      .status(200)
      .json({ message: "Password has been reset successfully." });
  } catch (error) {
    console.error("Reset password confirm error:", error);
    return res.status(500).json({ message: "Something went wrong." });
  }
};
