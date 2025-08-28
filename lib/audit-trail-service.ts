import { prisma } from './prisma';
import { PrismaClient, Prisma } from '@prisma/client';

export type AuditActionType =
  | 'status_change'
  | 'comment_added'
  | 'viewed'
  | 'document_added'
  | 'assignment_changed'
  | 'sla_updated'
  | 'priority_changed'
  | 'case_created'
  | 'case_updated'
  | 'case_reopened';

export interface UserInfo {
  id: string;
  name: string;
  role?: string;
}

export interface AuditEntryInput {
  action: AuditActionType;
  caseId: string;
  caseType: string;
  user: UserInfo;
  field?: string;
  oldValue?: string;
  newValue?: string;
  description?: string;
  metadata?: Record<string, any>;
}

export const auditTrailService = {
  // Add a new audit entry
  addAuditEntry: async (data: AuditEntryInput) => {
    return prisma.auditTrail.create({
      data: {
        action: data.action,
        caseId: data.caseId,
        caseType: data.caseType,
        userId: data.user.id,
        userName: data.user.name,
        userRole: data.user.role,
        field: data.field,
        oldValue: data.oldValue,
        newValue: data.newValue,
        description: data.description,
        metadata: data.metadata ? JSON.stringify(data.metadata) : null,
      },
    });
  },

  // Log status change
  logStatusChange: async (
    caseId: string,
    caseType: string,
    user: UserInfo,
    oldStatus: string,
    newStatus: string,
    description?: string
  ) => {
    return prisma.auditTrail.create({
      data: {
        action: 'status_change',
        caseId,
        caseType,
        userId: user.id,
        userName: user.name,
        userRole: user.role,
        field: 'status',
        oldValue: oldStatus,
        newValue: newStatus,
        description: description || `Status changed from "${oldStatus}" to "${newStatus}"`,
      },
    });
  },

  // Get latest status change
  getLatestStatusChange: async (caseId: string, caseType: string) => {
    return prisma.auditTrail.findFirst({
      where: {
        caseId,
        caseType,
        action: 'status_change',
      },
      orderBy: {
        timestamp: 'desc',
      },
    });
  },  

  // Log priority change
  logPriorityChange: async (
    caseId: string,
    caseType: string,
    user: UserInfo,
    oldPriority: string,
    newPriority: string
  ) => {
    return prisma.auditTrail.create({
      data: {
        action: 'priority_changed',
        caseId,
        caseType,
        userId: user.id,
        userName: user.name,
        userRole: user.role,
        field: 'priority',
        oldValue: oldPriority,
        newValue: newPriority,
        description: `Priority changed from "${oldPriority}" to "${newPriority}"`,
      },
    });
  },

  // Delete audit entries by caseId and caseType
  deleteAuditTrail: async (caseId: string, caseType: string) => {
    return prisma.auditTrail.deleteMany({
      where: {
        caseId,
        caseType
      },
    });
  },

  // Log SLA update
  logSLAUpdate: async (
    caseId: string,
    caseType: string,
    user: UserInfo,
    oldSLA: string | null,
    newSLA: string
  ) => {
    return prisma.auditTrail.create({
      data: {
        action: 'sla_updated',
        caseId,
        caseType,
        userId: user.id,
        userName: user.name,
        userRole: user.role,
        field: 'sla_deadline',
        oldValue: oldSLA || 'Not set',
        newValue: newSLA,
        description: 'SLA deadline updated',
      },
    });
  },

  // Log case view
  logCaseViewed: async (caseId: string, caseType: string, user: UserInfo) => {
    return prisma.auditTrail.create({
      data: {
        action: 'viewed',
        caseId,
        caseType,
        userId: user.id,
        userName: user.name,
        userRole: user.role,
        description: 'Case viewed',
      },
    });
  },

  // Log document added
  logDocumentAdded: async (
    caseId: string,
    caseType: string,
    user: UserInfo,
    documentName: string,
    metadata?: Record<string, any>
  ) => {
    return prisma.auditTrail.create({
      data: {
        action: 'document_added',
        caseId,
        caseType,
        userId: user.id,
        userName: user.name,
        userRole: user.role,
        description: `Document added: ${documentName}`,
        metadata: metadata ? JSON.stringify(metadata) : null,
      },
    });
  },

  // Get audit trail for a case
  getAuditTrail: async (caseId: string, caseType: string, filters?: {
    action?: AuditActionType | 'all';
    sortOrder?: 'newest' | 'oldest';
    limit?: number;
  }) => {
    const { action = 'all', sortOrder = 'newest', limit } = filters || {};
    
    return prisma.auditTrail.findMany({
      where: {
        caseId,
        caseType,
        ...(action !== 'all' ? { action } : {}),
      },
      orderBy: {
        timestamp: sortOrder === 'newest' ? 'desc' : 'asc',
      },
      ...(limit ? { take: limit } : {}),
    });
  },

  // Add a comment
  addComment: async (
    caseId: string,
    caseType: string,
    user: UserInfo,
    content: string
  ) => {
    // Create a transaction to add both the comment and the audit trail entry
    return prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      // Add the comment
      const comment = await tx.comment.create({
        data: {
          content,
          caseId,
          caseType,
          userId: user.id,
          userName: user.name,
          userRole: user.role,
        },
      });

      // Log in audit trail
      await tx.auditTrail.create({
        data: {
          action: 'comment_added',
          caseId,
          caseType,
          userId: user.id,
          userName: user.name,
          userRole: user.role,
          description: content.length > 100 ? content.substring(0, 97) + '...' : content,
        },
      });

      return comment;
    });
  },

  // Get comments for a case
  getComments: async (caseId: string, caseType: string) => {
    return prisma.comment.findMany({
      where: {
        caseId,
        caseType,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
  },
};