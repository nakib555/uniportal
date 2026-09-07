import { StudentDetails } from '../data';

export interface PortalSyncResult {
  success: boolean;
  studentData: StudentDetails;
  message?: string;
  source: 'live_portal' | 'cached_structure' | 'manual_paste';
}

// Backward compatibility alias
export type PuSyncResult = PortalSyncResult;

