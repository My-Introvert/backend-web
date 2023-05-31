import User from "../models/UserModel.js";
import argon from "argon2";

export const Login = async (req, res) => {
  const user = await User.findOne({
    where: {
      email: req.body.email,
    },
  });
  if (!user) return res.status(404).json({ msg: "Pengguna tidak ditemukan" });

  // check password in database with password user input match ?
  const match = await argon.verify(user.password, req.body.password);
  if (!match) return res.status(400).json({ msg: "Kata sandi kamu salah" });

  // Set session login
  req.session.userId = user.uuid;
  const uuid = user.uuid;
  const image = user.image;
  const urlImage = user.urlImage;
  const firstName = user.firstName;
  const lastName = user.lastName;
  const email = user.email;
  const role = user.role;
  res.status(200).json({ uuid, image, urlImage, firstName, lastName, email, role });
};

export const Me = async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ msg: "Mohon masuk ke akun Kamu!" });
  }
  const user = await User.findOne({
    attributes: ["uuid", "image", "urlImage", "firstName", "lastName", "email", "role"],
    where: {
      uuid: req.session.userId,
    },
  });
  if (!user) return res.status(404).json({ msg: "Pengguna tidak ditemukan" });
  res.status(200).json(user);
};

export const LogOut = (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(400).json({ msg: "Tidak bisa keluar" });
    res.status(200).json({ msg: "Kamu berhasil keluar" });
  });
};
