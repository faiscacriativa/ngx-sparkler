import { Profile } from "./profile";

export interface User {

  id: number;

  avatar?: string;
  email: string;
  password: string;

  profile?: Profile;

  created_at: string | Date;
  updated_at: string | Date;
  email_verified_at?: string;

}
