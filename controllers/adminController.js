const { Admin } = require("../models");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const { createTokenUser, attachCookiesToResponse } = require("../utils");

exports.registerAdmin = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password)
      throw new CustomError.BadRequestError(
        "Please enter an email and password"
      );
    const emailAlreadyExists = await Admin.findOne({ where: { email } });
    if (emailAlreadyExists)
      throw new CustomError.BadRequestError("Email already exists");
    const user = await Admin.create({ email, password });
    const tokenUser = createTokenUser(user);
    attachCookiesToResponse({ res, user: tokenUser });
    res.status(StatusCodes.CREATED).json({ data: tokenUser });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

exports.loginAdmin = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password)
      throw new CustomError.BadRequestError(
        "Please enter an email and password"
      );
    const user = await Admin.findOne({ where: { email } });
    if (!user) throw new CustomError.NotFoundError("who goes you?");
    const passwordIsCorrect = await user.comparePassword(password);
    if (!passwordIsCorrect)
      throw new CustomError.BadRequestError("Invalid credentials");
    const tokenUser = createTokenUser(user);
    attachCookiesToResponse({ res, user: tokenUser });
    res.status(StatusCodes.CREATED).json({ message: "login successfully" });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

exports.logoutAdmin = async (req, res) => {
  try {
    res.cookie("token", "logout", {
      httpOnly: true,
      expires: new Date(Date.now()),
    });
    res.status(StatusCodes.OK).json({ message: "You are logged out" });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

exports.getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.findAll({
      attributes: { exclude: ["password"] },
    });
    if (admins === null)
      throw new CustomError.NotFoundError("Admins not found");
    res.status(StatusCodes.OK).json({ data: admins });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

exports.viewMyAdminProfile = async (req, res) => {
  const adminId = req.user.userId;
  try {
    const admin = await Admin.findOne({ where: { id: adminId } });
    if (!admin) throw new CustomError.NotFoundError("Admin not found");
    const tokenUser = createTokenUser(admin);
    res.status(StatusCodes.OK).json({ data: tokenUser });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

exports.getSingleAdmin = async (req, res) => {
  const { id: adminId } = req.params;
  try {
    const admin = await Admin.findOne({ where: { id: adminId } });
    if (!admin) throw new CustomError.NotFoundError("Admin not found");
    const tokenUser = createTokenUser(admin);
    res.status(StatusCodes.OK).json({ data: tokenUser });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

exports.updateAdminPassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  try {
    if (!currentPassword || !newPassword)
      throw new CustomError.BadRequestError("Incomplete credentials");
    const admin = await Admin.findOne({ where: { id: req.user.userId } });
    if (!admin)
      throw new CustomError.NotFoundError("Admin not found, who goes you?");
    admin.password = newPassword;
    await admin.save();
    res.status(StatusCodes.OK).json({ message: "New Password Set" });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};
