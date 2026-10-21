export type AnnouncementStatus =
  | 'DRAFT'
  | 'PENDING_COMM_REVIEW'
  | 'REVISION_REQUESTED'
  | 'REJECTED'
  | 'APPROVED'
  | 'SCHEDULED'
  | 'DISPATCHED';

export type PublishChannel = 'outlook' | 'portal' | 'push';

export type PriorityLevel = 'normal' | 'onemli' | 'acil';

export interface AnnouncementSummaryDto {
  id: string;
  tenantCode: string;
  templateCode: string;
  title: string;
  priority: PriorityLevel;
  status: AnnouncementStatus;
  channels: PublishChannel[];
  targetAudience: string[];
  updatedAt: string;
}

export interface PagedAnnouncementsResponse {
  items: AnnouncementSummaryDto[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

export interface ApprovalDecisionRequest {
  decision: 'APPROVED' | 'REVISION_REQUESTED' | 'REJECTED';
  revisionReasonCodes?: string[];
  note?: string;
}

export interface ProblemDetails {
  type?: string;
  title: string;
  status: number;
  detail?: string;
  traceId?: string;
  errors?: Record<string, string[]>;
}
