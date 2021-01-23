export interface IVolunteer {
  _id?: string;
  activity_types: string[];
  address: string;
  age: number;
  availability: number;
  created_at: string;
  email: string;
  facebook_profile: string;
  first_name: string;
  is_active: boolean;
  last_name: string;
  latitude: number;
  longitude: number;
  phone: number;
  zone_address: string;
  //from Back-end https://github.com/code4moldova/voluntar-backend/blob/development/backend/models/volunteer_model.py
  zone: string;

  distance?: number;
  accepted_offer?: boolean;
  availability_day?: string;
  telegram_chat_id?: string;
  count?: number;
}
