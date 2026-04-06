export interface UpdateNoticeRequest {
  title?: string;
  content?: string;
}

export interface ManagementUnitDetail {
  id: number;
  name: string;
  approvalMethod: string;
  noticeTitle: string;
  noticeContent: string;
}