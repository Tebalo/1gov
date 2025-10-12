import { prisma } from "./prisma";

export interface CreateDraftData {
  content: string;
  formType: string;
  userId: string;
  status?: string;
  userName: string;
  currentStep?: number;
  userRole?: string;
  caseId?: string;
  caseType?: string;
}

export interface UpdateDraftData {
  content: string;
  currentStep?: number;
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
          currentStep: data.currentStep,
          userRole: data.userRole,
          caseType: data.caseType,
          updatedAt: new Date(),
        },
        create: {
          content: data.content,
          formType: data.formType,
          userId: data.userId,
          currentStep: data.currentStep,
          status: data.status || 'draft',
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

  // Get Draft that was updated recently
  getDraftByUpdateTime: async(userId: string)=>{
    try {
      const draft = await prisma.draft.findFirst({
        where:{
          userId: userId
        },
        orderBy:{
          updatedAt: 'desc' // Sort by most recently updated first
        }
      });
      return draft;
    } catch(error){
      console.error('Error fecthing draft', error)
      throw new Error('Failed to fetch draft')
    }
  },

  // Get a specific draft by ID
  getDraftById: async (draftId: string) => {
    try {
      const draft = await prisma.draft.findUnique({
        where: {
          id: draftId,
        },
      });
      return draft;
    } catch (error) {
      console.error('Error fetching draft by ID:', error);
      throw new Error('Failed to fetch draft by ID');
    }
  },

  // Update notification fields in a draft by ID
  updateDraftCorrectionFields: async (draftId: string, fields: string) => {
    try { 
      const updatedDraft = await prisma.draft.update({
        where:{
          id: draftId
        },
        data:{
          fields: fields,
          status:"correction",
          updatedAt: new Date()}
      });
      return updatedDraft;
    } catch (error) {
      throw new Error('Failed to update draft fields');
    }
  },

  // Update a draft by ID
  updateDraftById: async (draftId: string, updateData: UpdateDraftData) => {
    try {
      const updatedDraft = await prisma.draft.update({
        where: {
          id: draftId,
        },
        data: {
          content: updateData.content,
          currentStep: updateData.currentStep,
          updatedAt: new Date(),
        },
      });

      return updatedDraft;
    }
    catch (error) {
      console.error('Error updating draft by ID:', error);
      throw new Error('Failed to update draft by ID');
    }
  },
  // Update draft status by ID
  updateDraftStatus: async (draftId: string, status: string) => {
    try {
      const updatedDraft = await prisma.draft.update({
        where: {
          id: draftId,
        },
        data: {
          status: status,
          updatedAt: new Date(),
        },
      });
      return updatedDraft;
    } catch (error) {
      console.error('Error updating draft status by ID:', error);
      throw new Error('Failed to update draft status by ID');
    }
  },

  // Delete a draft by ID
  deleteDraftById: async (draftId: string) => {
    try {
      const deletedDraft = await prisma.draft.delete({
        where: {
          id: draftId,
        },
      });
      return deletedDraft;
    } catch (error) {
      console.error('Error deleting draft by ID:', error);
      throw new Error('Failed to delete draft by ID');
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

  // Get all drafts for a user by status
  getUserDraftsByStatus: async (userId: string, status?: string) => {
    try {
      const drafts = await prisma.draft.findMany({
        where: {
          userId: userId,
          status: status || 'draft',
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