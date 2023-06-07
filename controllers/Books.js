import Book from "../models/BookModel.js";
import User from "../models/UserModel.js";
import { Op } from "sequelize";
import path from "path";
import fs from "fs";

export const getBooks = async (req, res) => {
  try {
    let response;
    if (req.role === "admin") {
      response = await Book.findAll({
        attributes: ["uuid", "image", "urlImage", "title", "sumarry", "urlBuy"],
        include: [
          {
            model: User,
            attributes: ["firstName", "lastName", "email", "role"],
          },
        ],
      });
    } else {
      response = await Book.findAll({
        attributes: ["uuid", "image", "urlImage", "title", "sumarry", "urlBuy"],
        where: {
          userId: req.userId,
        },
        include: [
          {
            model: User,
            attributes: ["firstName", "lastName", "email"],
          },
        ],
      });
    }
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getBookById = async (req, res) => {
  try {
    const book = await Book.findOne({
      where: {
        uuid: req.params.id,
      },
    });
    if (!book) return res.status(404).json({ msg: "ID Buku tidak ditemukan" });

    let response;
    if (req.role === "admin") {
      response = await Book.findOne({
        attributes: ["uuid", "image", "urlImage", "title", "sumarry", "urlBuy"],
        where: {
          id: book.id,
        },
        include: [
          {
            model: User,
            attributes: ["firstName", "lastName", "email", "role"],
          },
        ],
      });
    } else {
      response = await Book.findOne({
        attributes: ["uuid", "image", "urlImage", "title", "sumarry", "urlBuy"],
        where: {
          [Op.and]: [{ id: book.id }, { userId: req.userId }],
        },
        include: [
          {
            model: User,
            attributes: ["firstName", "lastName", "email"],
          },
        ],
      });
    }
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const createBook = async (req, res) => {
  // Check which logged
  const user = await User.findOne({
    attributes: ["uuid", "firstName", "lastName", "email", "role"],
    where: {
      uuid: req.session.userId,
    },
  });

  if (req.files === null || req.files === "") return res.status(400).json({ msg: "Gambar tidak boleh kosong" });

  const { title, sumarry, urlBuy } = req.body;

  // image settings
  const image = req.files.image;
  const imageSize = image.data.length;
  const ext = path.extname(image.name);
  const imageName = image.md5 + ext;
  const urlImage = `${req.protocol}://${req.get("host")}/images/books/${imageName}`;
  const allowedTypeImage = [".jpg", ".jpeg", ".png", ".gif"];
  // Check type image
  if (!allowedTypeImage.includes(ext.toLocaleLowerCase())) return res.status(422).json({ msg: "Ekstensi gambar harus, Jpg, Jpeg, Png, Gif" });
  // Check image size
  if (imageSize > 2000000) return res.status(422).json({ msg: "Ukuran gambar harus dibawah 2MB" });
  // Move image
  image.mv(`./public/images/books/${imageName}`, (err) => {
    if (err) return res.status(500).json({ msg: err.message });
  });

  try {
    await Book.create({
      title: title,
      sumarry: sumarry,
      urlBuy: urlBuy,
      image: imageName,
      urlImage: urlImage,
      userId: req.userId,
    });
    res.status(201).json({ msg: "Kamu berhasil unggah Buku" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const updateBook = async (req, res) => {
  const book = await Book.findOne({
    where: {
      uuid: req.params.id,
    },
  });
  //   Check ID Book correct
  if (!book) return res.status(404).json({ msg: "ID Buku tidak ditemukan" });

  // Check Book changes image ?
  let imageName = "";
  if (req.files === null || req.files === "") {
    imageName = book.image;
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

    // Remove image from folder public/images
    const imagePath = `./public/images/books/${book.image}`;
    fs.unlinkSync(imagePath);
    // Move image
    image.mv(`./public/images/books/${imageName}`, (err) => {
      if (err) return res.status(500).json({ msg: err.message });
    });
  }

  const urlImage = `${req.protocol}://${req.get("host")}/images/books/${imageName}`;
  const { title, sumarry, urlBuy } = req.body;

  try {
    if (req.role === "admin") {
      await Book.update(
        { title: title, sumarry: sumarry, urlBuy: urlBuy, image: imageName, urlImage: urlImage },
        {
          where: {
            id: book.id,
          },
        }
      );
    } else {
      if (req.userId !== book.userId) return res.status(403).json({ msg: "Akses terlarang" });
      await Book.update(
        { title: title, sumarry: sumarry, urlBuy: urlBuy, image: imageName, urlImage: urlImage },
        {
          where: {
            [Op.and]: [{ id: book.id }, { userId: req.userId }],
          },
        }
      );
    }
    res.status(200).json({ msg: "Buku berhasil diperbarui" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const deleteBook = async (req, res) => {
  const book = await Book.findOne({
    where: {
      uuid: req.params.id,
    },
  });
  if (!book) return res.status(404).json({ msg: "ID Buku tidak ditemukan" });

  try {
    // Remove book from folder public/images
    const imagePath = `./public/images/books/${book.image}`;
    fs.unlinkSync(imagePath);

    if (req.role === "admin") {
      await Book.destroy({
        where: {
          id: book.id,
        },
      });
    } else {
      if (req.userId !== book.userId) return res.status(403).json({ msg: "Akses terlarang" });
      // Remove image from folder public/images
      const imagePath = `./public/images/blogs/${book.image}`;
      fs.unlinkSync(imagePath);
      await Book.destroy({
        where: {
          [Op.and]: [{ id: book.id }, { userId: req.userId }],
        },
      });
    }
    res.status(200).json({ msg: "Buku berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
