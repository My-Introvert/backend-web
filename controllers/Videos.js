import Video from "../models/VideoModel.js";
import User from "../models/UserModel.js";
import { Op } from "sequelize";

export const getVideos = async (req, res) => {
  try {
    let response;
    response = await Video.findAll({
      attributes: ["uuid", "title", "sumarry", "embededUrl", "label"],
      include: [
        {
          model: User,
          attributes: ["firstName", "lastName", "email", "role", "label"],
        },
      ],
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getVideoById = async (req, res) => {
  try {
    const video = await Video.findOne({
      where: {
        uuid: req.params.id,
      },
    });
    if (!video) return res.status(404).json({ msg: "ID Vidio tidak ditemukan" });

    let response;
    response = await Video.findOne({
      attributes: ["uuid", "title", "sumarry", "embededUrl", "label"],
      where: {
        id: video.id,
      },
      include: [
        {
          model: User,
          attributes: ["firstName", "lastName", "email", "role", "label"],
        },
      ],
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const createVideo = async (req, res) => {
  // Check which logged
  const user = await User.findOne({
    attributes: ["uuid", "firstName", "lastName", "email", "role"],
    where: {
      uuid: req.session.userId,
    },
  });

  const { title, sumarry, embededUrl, label } = req.body;
  try {
    await Video.create({
      title: title,
      sumarry: sumarry,
      embededUrl: embededUrl,
      label: label,
      userId: req.userId,
    });
    res.status(201).json({ msg: "Kamu berhasil unggah Vidio" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const updateVideo = async (req, res) => {
  try {
    const video = await Video.findOne({
      where: {
        uuid: req.params.id,
      },
    });
    if (!video) return res.status(404).json({ msg: "ID Vidio tidak ditemukan" });

    const { title, sumarry, embededUrl, label } = req.body;
    if (req.role === "admin") {
      await Video.update(
        { title, sumarry, embededUrl, label },
        {
          where: {
            id: video.id,
          },
        }
      );
    } else {
      if (req.userId !== video.userId) return res.status(403).json({ msg: "Akses terlarang" });
      await Video.update(
        { title, sumarry, embededUrl, label },
        {
          where: {
            [Op.and]: [{ id: video.id }, { userId: req.userId }],
          },
        }
      );
    }
    res.status(200).json({ msg: "Vidio berhasil diperbarui" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const deleteVideo = async (req, res) => {
  try {
    const video = await Video.findOne({
      where: {
        uuid: req.params.id,
      },
    });
    if (!video) return res.status(404).json({ msg: "ID Vidio tidak ditemukan" });

    if (req.role === "admin") {
      await Video.destroy({
        where: {
          id: video.id,
        },
      });
    } else {
      if (req.userId !== video.userId) return res.status(403).json({ msg: "Akses terlarang" });
      await Video.destroy({
        where: {
          [Op.and]: [{ id: video.id }, { userId: req.userId }],
        },
      });
    }
    res.status(200).json({ msg: "Vidio berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
