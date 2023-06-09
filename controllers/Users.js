import User from "../models/UserModel.js";
import argon from "argon2";
import path from "path";
import fs from "fs";

export const getUsers = async (req, res) => {
  try {
    const response = await User.findAll({
      attributes: ["uuid", "image", "urlImage", "firstName", "lastName", "email", "label", "role"],
      order: [["createdAt", "DESC"]],
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
      attributes: ["uuid", "image", "urlImage", "firstName", "lastName", "email", "label", "role"],
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
  if (req.files === null || req.files === "") return res.status(400).json({ msg: "Gambar tidak boleh kosong" });
  const { firstName, lastName, email, password, confPassword } = req.body;

  // Check if Role === Null
  let role;
  if (req.body.role === "" || req.body.role === null) {
    role = "user";
  } else {
    role = req.body.role;
  }
  // Check if Label === Null
  let label;
  if (req.body.label === "" || req.body.label === null) {
    label = "not-label";
  } else {
    label = req.body.label;
  }

  // image settings
  const image = req.files.image;
  const imageSize = image.data.length;
  const ext = path.extname(image.name);
  const imageName = image.md5 + ext;
  const urlImage = `${req.protocol}://${req.get("host")}/images/users/${imageName}`;
  const allowedTypeImage = [".jpg", ".jpeg", ".png", ".gif"];
  // Check type image
  if (!allowedTypeImage.includes(ext.toLocaleLowerCase())) return res.status(422).json({ msg: "Ekstensi gambar harus, Jpg, Jpeg, Png, Gif" });
  // Check image size
  if (imageSize > 2000000) return res.status(422).json({ msg: "Ukuran gambar harus dibawah 2MB" });
  // Move image
  image.mv(`./public/images/users/${imageName}`, (err) => {
    if (err) return res.status(500).json({ msg: err.message });
  });

  //   Confirm if Pass and Conf Pass does'n match
  if (password !== confPassword) return res.status(400).json({ msg: "Konfirmasi kata sandi kamu tidak cocok" });
  const hashPassword = await argon.hash(password);

  try {
    await User.create({
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: hashPassword,
      image: imageName,
      urlImage: urlImage,
      label: label,
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
  // Check user changes image ?
  let imageName = "";
  if (req.files === null || req.files === "") {
    imageName = user.image;
  } else {
    const image = req.files.image;
    const imageSize = image.data.length;
    const ext = path.extname(image.name);
    imageName = image.md5 + ext;
    const allowedTypeImage = [".jpg", ".jpeg", ".png", ".gif"];

    // Check type image
    if (!allowedTypeImage.includes(ext.toLocaleLowerCase())) return res.status(422).json({ msg: "Ekstensi gambar harus, Jpg, Jpeg, Png, Gif" });
    // Check image size
    if (imageSize > 2000000) return res.status(422).json({ msg: "Ukuran gambar harus dibawah 2MB" });

    if (user.image === "user-default.png") {
      // Move image
      image.mv(`./public/images/users/${imageName}`, (err) => {
        if (err) return res.status(500).json({ msg: err.message });
      });
    }
    if (user.image !== User.image) {
      // Move image
      image.mv(`./public/images/users/${imageName}`, (err) => {
        if (err) return res.status(500).json({ msg: err.message });
      });
    } else {
      // Move image
      image.mv(`./public/images/users/${imageName}`, (err) => {
        if (err) return res.status(500).json({ msg: err.message });
      });
      // Remove image from folder public/images
      const imagePath = `./public/images/users/${user.image}`;
      fs.unlinkSync(imagePath);
    }
  }

  const urlImage = `${req.protocol}://${req.get("host")}/images/users/${imageName}`;
  // Req.body other data from user
  const { firstName, lastName, email, password, confPassword, label, role } = req.body;

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
        image: imageName,
        urlImage: urlImage,
        label: label,
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
    // Remove image from folder public/images
    const imagePath = `./public/images/users/${user.image}`;
    fs.unlinkSync(imagePath);

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
