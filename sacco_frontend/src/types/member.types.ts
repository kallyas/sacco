export interface Member {
  id: number;
  user: {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    phone_number: string;
    gender?: "M" | "F" | "O";
    is_verified: boolean;
  };
  member_number: string;
  date_of_birth: string;
  marital_status: "SINGLE" | "MARRIED" | "DIVORCED" | "WIDOWED";
  employment_status:
    | "EMPLOYED"
    | "SELF_EMPLOYED"
    | "UNEMPLOYED"
    | "RETIRED"
    | "STUDENT"
    | "OTHER";
  occupation: string;
  monthly_income: number;
  physical_address: string;
  postal_address?: string;
  city: string;
  district: string;
  national_id: string;
  passport_photo?: string;
  id_document?: string;
  is_verified: boolean;
  registration_date: string;
  membership_status: string;
  membership_number: string;
  membership_type: "INDIVIDUAL" | "JOINT" | "CORPORATE";
  created_at: string;
  updated_at: string;
  savings_account?: {
    id: number;
    account_number: string;
    balance: number;
    account_type: string;
    status: string;
  };
  next_of_kin?: NextOfKin[];
  documents?: MemberDocument[];
  loans_count?: number;
  total_savings?: number;
  outstanding_loans?: number;
}

export interface NextOfKin {
  id: number;
  member: number;
  full_name: string;
  relationship: "SPOUSE" | "CHILD" | "PARENT" | "SIBLING" | "OTHER";
  phone_number: string;
  email?: string;
  physical_address: string;
  national_id: string;
  percentage_share: number;
  created_at: string;
  updated_at: string;
}

export interface MemberDocument {
  id: number;
  member: number;
  document_type:
    | "ID"
    | "PASSPORT"
    | "UTILITY_BILL"
    | "BANK_STATEMENT"
    | "OTHER";
  document: string;
  description?: string;
  is_verified: boolean;
  verified_by?: number;
  verified_at?: string;
  uploaded_at: string;
  updated_at: string;
}

export interface MemberRegistrationRequest {
  member: {
    date_of_birth: string;
    marital_status: "SINGLE" | "MARRIED" | "DIVORCED" | "WIDOWED";
    employment_status:
      | "EMPLOYED"
      | "SELF_EMPLOYED"
      | "UNEMPLOYED"
      | "RETIRED"
      | "STUDENT"
      | "OTHER";
    occupation: string;
    monthly_income: number;
    physical_address: string;
    postal_address?: string;
    city: string;
    district: string;
    national_id: string;
    membership_type: "INDIVIDUAL" | "JOINT" | "CORPORATE";
  };
  next_of_kin: Omit<NextOfKin, "id" | "member" | "created_at" | "updated_at">[];
}

export interface MemberUpdateRequest {
  marital_status?: "SINGLE" | "MARRIED" | "DIVORCED" | "WIDOWED";
  employment_status?:
    | "EMPLOYED"
    | "SELF_EMPLOYED"
    | "UNEMPLOYED"
    | "RETIRED"
    | "STUDENT"
    | "OTHER";
  occupation?: string;
  monthly_income?: number;
  physical_address?: string;
  postal_address?: string;
  city?: string;
  district?: string;
}

export interface MemberStatusUpdateRequest {
  status: "ACTIVE" | "INACTIVE" | "SUSPENDED" | "TERMINATED";
  reason?: string;
}

export interface MemberSearchParams {
  search?: string;
  membership_status?: string;
  membership_type?: string;
  registration_date_start?: string;
  registration_date_end?: string;
  page?: number;
  page_size?: number;
}

export interface MemberStatistics {
  total_members: number;
  active_members: number;
  new_members_this_month: number;
  members_by_type: {
    type: string;
    count: number;
  }[];
  members_by_status: {
    status: string;
    count: number;
  }[];
}

export interface DocumentUploadRequest {
  document_type:
    | "ID"
    | "PASSPORT"
    | "UTILITY_BILL"
    | "BANK_STATEMENT"
    | "OTHER";
  description?: string;
  document: File;
}
