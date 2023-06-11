import Note from "../models/NoteModel.js";
import User from "../models/UserModel.js";
import { Op } from "sequelize";

export const getNotes = async (req, res) => {
  try {
    let response;
    if (req.role === "admin") {
      response = await Note.findAll({
        attributes: ["uuid", "title", "sumarry", "createdAt"],
        include: [
          {
            model: User,
            attributes: ["firstName", "lastName", "email", "role"],
          },
        ],
      });
    } else {
      response = await Note.findAll({
        attributes: ["uuid", "title", "sumarry", "createdAt"],
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

export const getNoteById = async (req, res) => {
  try {
    const note = await Note.findOne({
      where: {
        uuid: req.params.id,
      },
    });
    if (!note) return res.status(404).json({ msg: "ID Catatan tidak ditemukan" });

    let response;
    if (req.role === "admin") {
      response = await Note.findOne({
        attributes: ["uuid", "title", "sumarry", "createdAt"],
        where: {
          id: note.id,
        },
        include: [
          {
            model: User,
            attributes: ["firstName", "lastName", "email", "role"],
          },
        ],
      });
    } else {
      response = await Note.findOne({
        attributes: ["uuid", "title", "sumarry", "createdAt"],
        where: {
          [Op.and]: [{ id: note.id }, { userId: req.userId }],
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

export const createNote = async (req, res) => {
  // Check which logged
  const user = await User.findOne({
    attributes: ["uuid", "firstName", "lastName", "email", "role"],
    where: {
      uuid: req.session.userId,
    },
  });

  const { title, sumarry } = req.body;
  try {
    await Note.create({
      title: title,
      sumarry: sumarry,
      userId: req.userId,
    });
    res.status(201).json({ msg: `Yeay ${user.firstName}, Catatan kamu berhasil dibuat` });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const updateNote = async (req, res) => {
  try {
    const note = await Note.findOne({
      where: {
        uuid: req.params.id,
      },
    });
    if (!note) return res.status(404).json({ msg: "ID Catatan tidak ditemukan" });

    const { title, sumarry } = req.body;
    if (req.role === "admin") {
      await Note.update(
        { title, sumarry },
        {
          where: {
            id: note.id,
          },
        }
      );
    } else {
      if (req.userId !== note.userId) return res.status(403).json({ msg: "Akses terlarang" });
      await Note.update(
        { title, sumarry },
        {
          where: {
            [Op.and]: [{ id: note.id }, { userId: req.userId }],
          },
        }
      );
    }
    res.status(200).json({ msg: "Catatan berhasil diperbarui" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const deleteNote = async (req, res) => {
  try {
    const note = await Note.findOne({
      where: {
        uuid: req.params.id,
      },
    });
    if (!note) return res.status(404).json({ msg: "ID Catatan tidak ditemukan" });

    if (req.role === "admin") {
      await Note.destroy({
        where: {
          id: note.id,
        },
      });
    } else {
      if (req.userId !== note.userId) return res.status(403).json({ msg: "Akses terlarang" });
      await Note.destroy({
        where: {
          [Op.and]: [{ id: note.id }, { userId: req.userId }],
        },
      });
    }
    res.status(200).json({ msg: "Catatan berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
