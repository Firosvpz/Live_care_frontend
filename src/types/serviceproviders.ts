export interface ServiceProvider {
    _id: string;
    name: string;
    email: string;
    phone_number: string;
    service: string;
    specialization: string;
    qualification: string;
    profile_picture: string;
    experience_crt: string;
    exp_year: number;
    rate: number;
    gender: string;
    is_approved: boolean;
    is_blocked: boolean;
    createdAt: string; 
    hasCompletedDetails: boolean;
  }