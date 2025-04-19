export interface Member {
  id: number;
  user: {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    phone_number: string;
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
  };
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
  next_of_kin: NextOfKin[];
}
