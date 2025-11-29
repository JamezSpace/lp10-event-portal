export interface PersonApiModel {
  _id: string;
  first_name: string;
  last_name: string;
  email: string;
  year_of_birth: number;
  gender: string;
  origin: string;
  denomination?: string;
  church_id?: string;
  details?: string;
  created_at: string;
  modified_at: string;
}
