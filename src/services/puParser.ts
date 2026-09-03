import { StudentDetails } from '../data';

export interface PuSyncResult {
  success: boolean;
  studentData: StudentDetails;
  message?: string;
  source: 'live_portal' | 'cached_structure' | 'manual_paste';
}
