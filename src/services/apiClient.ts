import type {
  AnnouncementSummaryDto,
  ApprovalDecisionRequest,
  PagedAnnouncementsResponse
} from '../types/announcement';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.staging.arel.edu.tr';

export class ApiClient {
  private tenantCode: string;
  private accessToken: string | null;

  constructor(tenantCode = 'ik', accessToken: string | null = null) {
    this.tenantCode = tenantCode;
    this.accessToken = accessToken;
  }

  private getHeaders(): HeadersInit {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'X-Tenant': this.tenantCode,
      'X-Tenant-Code': this.tenantCode
    };
    if (this.accessToken) {
      headers['Authorization'] = `Bearer ${this.accessToken}`;
    }
    return headers;
  }

  async listSubmissions(page = 1, pageSize = 20): Promise<PagedAnnouncementsResponse> {
    const res = await fetch(`${BASE_URL}/api/v1/announcements/submissions?page=${page}&pageSize=${pageSize}`, {
      headers: this.getHeaders()
    });
    if (!res.ok) throw new Error(`Duyuru listesi alınamadı (${res.status})`);
    return res.json() as Promise<PagedAnnouncementsResponse>;
  }

  async submitDecision(submissionId: string, payload: ApprovalDecisionRequest): Promise<AnnouncementSummaryDto> {
    const res = await fetch(`${BASE_URL}/api/v1/announcements/submissions/${encodeURIComponent(submissionId)}/decision`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error(`Onay kararı iletilemedi (${res.status})`);
    return res.json() as Promise<AnnouncementSummaryDto>;
  }
}
