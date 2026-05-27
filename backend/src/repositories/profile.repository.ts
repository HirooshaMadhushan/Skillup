import prisma from '../config/prisma';
import { UpdateLearnerInput, UpdateTutorInput } from '../utils/profile.validation';

export class ProfileRepository {
  async getProfile(userId: string) {
    return prisma.user.findUnique({
      where: { id: userId },
      include: {
        userRoles: { include: { role: true } },
        learnerProfile: true,
        tutorProfile: true,
      },
    });
  }

  async updateLearnerProfile(userId: string, data: UpdateLearnerInput) {
    const { fullName, bio, profileImage, ...profileData } = data;
    
    return prisma.$transaction(async (tx) => {
      // Update User fields
      await tx.user.update({
        where: { id: userId },
        data: { fullName, bio, profileImage },
      });

      // Update LearnerProfile fields
      return tx.learnerProfile.update({
        where: { userId },
        data: profileData,
        include: { user: true },
      });
    });
  }

  async updateTutorProfile(userId: string, data: UpdateTutorInput) {
    const { fullName, bio, profileImage, ...profileData } = data;

    return prisma.$transaction(async (tx) => {
      // Update User fields
      await tx.user.update({
        where: { id: userId },
        data: { fullName, bio, profileImage },
      });

      // Update TutorProfile fields
      return tx.tutorProfile.update({
        where: { userId },
        data: profileData,
        include: { user: true },
      });
    });
  }

  async getAllTutors() {
    return prisma.tutorProfile.findMany({
      where: { isAvailable: true },
      include: {
        user: {
          select: {
            fullName: true,
            profileImage: true,
            bio: true,
          },
        },
      },
    });
  }
}
