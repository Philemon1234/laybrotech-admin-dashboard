export type EnquiryStatus = 'new' | 'read' | 'resolved';

export type Enquiry = {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  company: string | null;
  subject: string;
  message: string;
  status: EnquiryStatus;
  created_at: string;
  updated_at: string;
};
