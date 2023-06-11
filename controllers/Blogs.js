import Blog from "../models/BlogModel.js";
import User from "../models/UserModel.js";
import { Op } from "sequelize";
import path from "path";
import fs from "fs";

export const getBlogs = async (req, res) => {
  try {
    let response;
    if (req.role === "admin") {
      response = await Blog.findAll({
        attributes: ["uuid", "image", "urlImage", "title", "label", "sumarry", "blog"],
        include: [
          {
            model: User,
            attributes: ["urlImage", "firstName", "lastName", "email", "role"],
          },
        ],
      });
    } else {
      response = await Blog.findAll({
        attributes: ["uuid", "image", "urlImage", "title", "label", "sumarry", "blog"],
        where: {
          userId: req.userId,
        },
        include: [
          {
            model: User,
            attributes: ["urlImage", "firstName", "lastName", "email"],
          },
        ],
      });
    }
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findOne({
      where: {
        uuid: req.params.id,
      },
    });
    if (!blog) return res.status(404).json({ msg: "ID Blog tidak ditemukan" });

    let response;
    if (req.role === "admin") {
      response = await Blog.findOne({
        attributes: ["uuid", "image", "urlImage", "title", "label", "sumarry", "blog"],
        where: {
          id: blog.id,
        },
        include: [
          {
            model: User,
            attributes: ["urlImage", "firstName", "lastName", "email", "role"],
          },
        ],
      });
    } else {
      response = await Blog.findOne({
        attributes: ["uuid", "image", "urlImage", "title", "label", "sumarry", "blog"],
        where: {
          [Op.and]: [{ id: blog.id }, { userId: req.userId }],
        },
        include: [
          {
            model: User,
            attributes: ["urlImage", "firstName", "lastName", "email"],
          },
        ],
      });
    }
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const createBlog = async (req, res) => {
  // Check which logged
  const user = await User.findOne({
    attributes: ["uuid", "firstName", "lastName", "email", "role"],
    where: {
      uuid: req.session.userId,
    },
  });

  if (req.files === null || req.files === "") return res.status(400).json({ msg: "Gambar tidak boleh kosong" });

  const { title, label, sumarry, blog } = req.body;
  // image settings
  const image = req.files.image;
  const imageSize = image.data.length;
  const ext = path.extname(image.name);
  const imageName = image.md5 + ext;
  const urlImage = `${req.protocol}://${req.get("host")}/images/blogs/${imageName}`;
  const allowedTypeImage = [".jpg", ".jpeg", ".png", ".gif"];
  // Check type image
  if (!allowedTypeImage.includes(ext.toLocaleLowerCase())) return res.status(422).json({ msg: "Ekstensi gambar harus, Jpg, Jpeg, Png, Gif" });
  // Check image size
  if (imageSize > 2000000) return res.status(422).json({ msg: "Ukuran gambar harus dibawah 2MB" });
  // Move image
  image.mv(`./public/images/blogs/${imageName}`, (err) => {
    if (err) return res.status(500).json({ msg: err.message });
  });

  try {
    await Blog.create({
      title: title,
      label: label,
      sumarry: sumarry,
      blog: blog,
      image: imageName,
      urlImage: urlImage,
      userId: req.userId,
    });
    res.status(201).json({ msg: "Blog kamu berhasil dibuat" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const updateBlog = async (req, res) => {
  const article = await Blog.findOne({
    where: {
      uuid: req.params.id,
    },
  });
  //   Check ID Blog correct
  if (!article) return res.status(404).json({ msg: "ID Blog tidak ditemukan" });

  // Check blog changes image ?
  let imageName = "";
  if (req.files === null || req.files === "") {
    imageName = article.image;
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
    const imagePath = `./public/images/blogs/${article.image}`;
    fs.unlinkSync(imagePath);
    // Move image
    image.mv(`./public/images/blogs/${imageName}`, (err) => {
      if (err) return res.status(500).json({ msg: err.message });
    });
  }

  const urlImage = `${req.protocol}://${req.get("host")}/images/blogs/${imageName}`;
  const { title, label, sumarry, blog } = req.body;

  try {
    if (req.role === "admin") {
      await Blog.update(
        { title: title, label: label, sumarry: sumarry, blog: blog, image: imageName, urlImage: urlImage },
        {
          where: {
            id: article.id,
          },
        }
      );
    } else {
      if (req.userId !== article.userId) return res.status(403).json({ msg: "Akses terlarang" });
      await Blog.update(
        { title: title, label: label, sumarry: sumarry, blog: blog, image: imageName, urlImage: urlImage },
        {
          where: {
            [Op.and]: [{ id: article.id }, { userId: req.userId }],
          },
        }
      );
    }
    res.status(200).json({ msg: "Blog berhasil diperbarui" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const deleteBlog = async (req, res) => {
  const blog = await Blog.findOne({
    where: {
      uuid: req.params.id,
    },
  });
  if (!blog) return res.status(404).json({ msg: "ID Blog tidak ditemukan" });

  try {
    // Remove image from folder public/images
    const imagePath = `./public/images/blogs/${blog.image}`;
    fs.unlinkSync(imagePath);

    if (req.role === "admin") {
      await Blog.destroy({
        where: {
          id: blog.id,
        },
      });
    } else {
      if (req.userId !== blog.userId) return res.status(403).json({ msg: "Akses terlarang" });
      // Remove image from folder public/images
      const imagePath = `./public/images/blogs/${blog.image}`;
      fs.unlinkSync(imagePath);
      await Blog.destroy({
        where: {
          [Op.and]: [{ id: blog.id }, { userId: req.userId }],
        },
      });
    }
    res.status(200).json({ msg: "Blog berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
