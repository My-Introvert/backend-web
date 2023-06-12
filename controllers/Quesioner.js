import Quesioner from "../models/QuesionerModel.js";
import User from "../models/UserModel.js";
import { Op } from "sequelize";

export const getQuesioners = async (req, res) => {
  try {
    let response;
    if (req.role === "admin") {
      response = await Quesioner.findAll({
        attributes: ["uuid", "yourIntrovert", "levelIntrovert", "age", "gender", "status", "publicSpeaking", "leadership", "meetStrangers", "crowd", "oldFriends", "onlineActivities", "offlineActivities", "createdAt"],
        order: [["createdAt", "DESC"]],
        include: [
          {
            model: User,
            attributes: ["urlImage", "firstName", "lastName", "email", "label", "role"],
          },
        ],
      });
    } else {
      response = await Quesioner.findAll({
        attributes: ["uuid", "yourIntrovert", "levelIntrovert", "age", "gender", "status", "publicSpeaking", "leadership", "meetStrangers", "crowd", "oldFriends", "onlineActivities", "offlineActivities", "createdAt"],
        order: [["createdAt", "DESC"]],
        where: {
          userId: req.userId,
        },
        include: [
          {
            model: User,
            attributes: ["urlImage", "firstName", "lastName", "email", "label"],
          },
        ],
      });
    }
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getQuesionerById = async (req, res) => {
  try {
    const quesioner = await Quesioner.findOne({
      where: {
        uuid: req.params.id,
      },
    });
    if (!quesioner) return res.status(404).json({ msg: "ID Kuisioner tidak ditemukan" });

    let response;
    if (req.role === "admin") {
      response = await Quesioner.findOne({
        attributes: ["uuid", "yourIntrovert", "levelIntrovert", "age", "gender", "status", "publicSpeaking", "leadership", "meetStrangers", "crowd", "oldFriends", "onlineActivities", "offlineActivities"],
        where: {
          id: quesioner.id,
        },
        include: [
          {
            model: User,
            attributes: ["urlImage", "firstName", "lastName", "email", "label", "role"],
          },
        ],
      });
    } else {
      response = await Quesioner.findOne({
        attributes: ["uuid", "yourIntrovert", "levelIntrovert", "age", "gender", "status", "publicSpeaking", "leadership", "meetStrangers", "crowd", "oldFriends", "onlineActivities", "offlineActivities"],
        where: {
          [Op.and]: [{ id: quesioner.id }, { userId: req.userId }],
        },
        include: [
          {
            model: User,
            attributes: ["urlImage", "firstName", "lastName", "email", "label"],
          },
        ],
      });
    }
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const createQuesioner = async (req, res) => {
  // Check which logged
  const user = await User.findOne({
    attributes: ["uuid", "firstName", "lastName", "email", "label", "role"],
    where: {
      uuid: req.session.userId,
    },
  });

  const { yourIntrovert, levelIntrovert, age, gender, status, publicSpeaking, leadership, meetStrangers, crowd, oldFriends, onlineActivities, offlineActivities } = req.body;
  try {
    await Quesioner.create({
      yourIntrovert: yourIntrovert,
      levelIntrovert: levelIntrovert,
      age: age,
      gender: gender,
      status: status,
      publicSpeaking: publicSpeaking,
      leadership: leadership,
      meetStrangers: meetStrangers,
      crowd: crowd,
      oldFriends: oldFriends,
      onlineActivities: onlineActivities,
      offlineActivities: offlineActivities,
      userId: req.userId,
    });
    res.status(201).json({ msg: "Kuisioner kamu berhasil dibuat" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const updateQuesioner = async (req, res) => {
  try {
    const quesioner = await Quesioner.findOne({
      where: {
        uuid: req.params.id,
      },
    });
    if (!quesioner) return res.status(404).json({ msg: "ID Kuisioner tidak ditemukan" });

    const { yourIntrovert, levelIntrovert, age, gender, status, publicSpeaking, leadership, meetStrangers, crowd, oldFriends, onlineActivities, offlineActivities } = req.body;
    if (req.role === "admin") {
      await Quesioner.update(
        {
          yourIntrovert: yourIntrovert,
          levelIntrovert: levelIntrovert,
          age: age,
          gender: gender,
          status: status,
          publicSpeaking: publicSpeaking,
          leadership: leadership,
          meetStrangers: meetStrangers,
          crowd: crowd,
          oldFriends: oldFriends,
          onlineActivities: onlineActivities,
          offlineActivities: offlineActivities,
          userId: req.userId,
        },
        {
          where: {
            id: quesioner.id,
          },
        }
      );
    } else {
      if (req.userId !== quesioner.userId) return res.status(403).json({ msg: "Akses terlarang" });
      await Quesioner.update(
        {
          yourIntrovert: yourIntrovert,
          levelIntrovert: levelIntrovert,
          age: age,
          gender: gender,
          status: status,
          publicSpeaking: publicSpeaking,
          leadership: leadership,
          meetStrangers: meetStrangers,
          crowd: crowd,
          oldFriends: oldFriends,
          onlineActivities: onlineActivities,
          offlineActivities: offlineActivities,
          userId: req.userId,
        },
        {
          where: {
            [Op.and]: [{ id: quesioner.id }, { userId: req.userId }],
          },
        }
      );
    }
    res.status(200).json({ msg: "Kuisioner berhasil diperbarui" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const deleteQuesioner = async (req, res) => {
  try {
    const quesioner = await Quesioner.findOne({
      where: {
        uuid: req.params.id,
      },
    });
    if (!quesioner) return res.status(404).json({ msg: "ID Kuisioner tidak ditemukan" });

    if (req.role === "admin") {
      await Quesioner.destroy({
        where: {
          id: quesioner.id,
        },
      });
    } else {
      if (req.userId !== quesioner.userId) return res.status(403).json({ msg: "Akses terlarang" });
      await Quesioner.destroy({
        where: {
          [Op.and]: [{ id: quesioner.id }, { userId: req.userId }],
        },
      });
    }
    res.status(200).json({ msg: "Kuisioner berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
