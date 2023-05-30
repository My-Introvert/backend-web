import User from "../models/UserModel.js";
import argon from "argon2";

export const getUsers = async (req, res) => {
  try {
    const response = await User.findAll({
      attributes: ["uuid", "firstName", "lastName", "email", "role"],
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getUserById = async (req, res) => {
  const user = await User.findOne({
    where: {
      uuid: req.params.id,
    },
  });

  //   Check ID User correct
  if (!user) return res.status(404).json({ msg: "Pengguna tidak ditemukan" });

  try {
    const response = await User.findOne({
      attributes: ["uuid", "firstName", "lastName", "email", "role"],
      where: {
        uuid: req.params.id,
      },
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const createUser = async (req, res) => {
  const { firstName, lastName, email, password, confPassword, role } = req.body;

  //   Confirm if Pass and Conf Pass does'n match
  if (password !== confPassword) return res.status(400).json({ msg: "Konfirmasi kata sandi kamu tidak cocok" });
  const hashPassword = await argon.hash(password);

  try {
    await User.create({
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: hashPassword,
      role: role,
    });
    res.status(201).json({ msg: `${firstName}, berhasil terdaftar` });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

export const updateUser = async (req, res) => {
  const user = await User.findOne({
    where: {
      uuid: req.params.id,
    },
  });

  //   Check ID User correct
  if (!user) return res.status(404).json({ msg: "Pengguna tidak ditemukan" });

  const { firstName, lastName, email, password, confPassword, role } = req.body;
  let hashPassword;
  if (password === "" || password === null) {
    hashPassword = user.password;
  } else {
    hashPassword = await argon.hash(password);
  }

  //   Check pass and Conf Pass does'n match
  if (password !== confPassword) return res.status(400).json({ msg: "Konfirmasi kata sandi kamu tidak cocok" });

  //   If all validation correct, update data in database
  try {
    await User.update(
      {
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: hashPassword,
        role: role,
      },
      {
        where: {
          id: user.id,
        },
      }
    );
    res.status(200).json({ msg: `${firstName}, kamu berhasil memperbarui data` });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

export const deleteUser = async (req, res) => {
  const user = await User.findOne({
    where: {
      uuid: req.params.id,
    },
  });

  //   Check ID User correct
  if (!user) return res.status(404).json({ msg: "Pengguna tidak ditemukan" });

  //   If exist user, deleted data
  try {
    await User.destroy({
      where: {
        id: user.id,
      },
    });
    res.status(200).json({ msg: `Data dengan ID ${req.params.id} berhasil dihapus` });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};
