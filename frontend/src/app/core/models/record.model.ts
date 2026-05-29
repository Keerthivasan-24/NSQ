export interface Record {
  id: string;
  userId: string;
  verificationType: string;
  status: string;
  submittedDate: string;
  accessLevel: string;
  processingTime: string;
}

export interface RecordResponse {
  success: boolean;
  records: Record[];
}
