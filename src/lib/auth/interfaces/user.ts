import { Profile } from "./profile";

export interface User {

  id?: number;
  avatar?: string;
  email?: string;
  password?: string;
  email_verified_at?: string;
  created_at?: string;
  updated_at?: string;

  profile?: Profile;

}
