import { Response, NextFunction } from 'express';
import { ProfileService } from '../services/profile.service';
import { AuthRequest } from '../middlewares/auth.middleware';

const profileService = new ProfileService();

export class ProfileController {
  async getMyProfile(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const profile = await profileService.getProfile(req.user!.userId);
      res.status(200).json({
        success: true,
        data: profile,
      });
    } catch (error: any) {
      next(error);
    }
  }

  async updateMyProfile(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const roles = req.user!.roles;
      let updatedProfile;

      const updateData = req.file ? {
        ...req.body,
        profileImage: `/uploads/profiles/${req.file.filename}`,
      } : req.body;

      if (roles.includes('TUTOR')) {
        updatedProfile = await profileService.updateTutorProfile(userId, updateData);
      } else if (roles.includes('LEARNER')) {
        updatedProfile = await profileService.updateLearnerProfile(userId, updateData);
      } else {
        throw new Error('No specific profile found for this role');
      }

      res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        data: updatedProfile,
      });
    } catch (error: any) {
      next(error);
    }
  }

  async getTutorProfiles(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const tutors = await profileService.getTutors();
      res.status(200).json({
        success: true,
        data: tutors,
      });
    } catch (error: any) {
      next(error);
    }
  }
}
