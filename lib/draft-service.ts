import { prisma } from "./prisma";

export interface CreateDraftData {
  content: string;
  formType: string;
  userId: string;
  userName: string;
  userRole?: string;
  caseId?: string;
  caseType?: string;
}

export interface UpdateDraftData {
  content: string;
}

export const draftService = {
  // Save or update a draft
  saveDraft: async (data: CreateDraftData) => {
    try {
      const draft = await prisma.draft.upsert({
        where: {
          userId_formType_caseId: {
            userId: data.userId,
            formType: data.formType,
            caseId: data.caseId ?? '',
          },
        },
        update: {
          content: data.content,
          userName: data.userName,
          userRole: data.userRole,
          caseType: data.caseType,
          updatedAt: new Date(),
        },
        create: {
          content: data.content,
          formType: data.formType,
          userId: data.userId,
          userName: data.userName,
          userRole: data.userRole,
          caseId: data.caseId,
          caseType: data.caseType,
        },
      });

      return draft;
    } catch (error) {
      console.error('Error saving draft:', error);
      throw new Error('Failed to save draft');
    }
  },

  // Get a specific draft
  getDraft: async (userId: string, formType: string, caseId?: string) => {
    try {
      const draft = await prisma.draft.findUnique({
        where: {
          userId_formType_caseId: {
            userId,
            formType,
            caseId: caseId || '',
          },
        },
      });

      return draft;
    } catch (error) {
      console.error('Error fetching draft:', error);
      throw new Error('Failed to fetch draft');
    }
  },

  // Get all drafts for a user
  getUserDrafts: async (userId: string) => {
    try {
      const drafts = await prisma.draft.findMany({
        where: {
          userId: userId,
        },
        orderBy: {
          updatedAt: 'desc',
        },
      });

      return drafts;
    } catch (error) {
      console.error('Error fetching user drafts:', error);
      throw new Error('Failed to fetch drafts');
    }
  },

  // Delete a draft
  deleteDraft: async (userId: string, formType: string, caseId?: string) => {
    try {
      const draft = await prisma.draft.delete({
        where: {
          userId_formType_caseId: {
            userId,
            formType,
            caseId: caseId || '',
          },
        },
      });

      return draft;
    } catch (error) {
      console.error('Error deleting draft:', error);
      throw new Error('Failed to delete draft');
    }
  },

  // Get drafts by case
  getCaseDrafts: async (caseId: string, caseType: string) => {
    try {
      const drafts = await prisma.draft.findMany({
        where: {
          caseId,
          caseType,
        },
        orderBy: {
          updatedAt: 'desc',
        },
      });

      return drafts;
    } catch (error) {
      console.error('Error fetching case drafts:', error);
      throw new Error('Failed to fetch case drafts');
    }
  },
};