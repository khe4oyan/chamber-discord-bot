import prisma from "../config/prisma.js";

export default class SettingsService {
  static async getByTitle(title) {
    return await prisma.settings.findFirst({
      where: {
        title,
      },
    });
  }

  static async create(title) {
    return await prisma.settings.create({
      data: {
        title,
      },
    });
  }

  static async updateVersion(title, newVersion) {
    await prisma.settings.update({
      where: {
        title,
      },
      data: {
        version: newVersion,
      },
    });
  }
}
