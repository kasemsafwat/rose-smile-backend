export interface Idoctor extends Document {
  name: string;
  phone_whatsapp: string;
  image: {
    url: string;
    id: string;
  };
  specialization: string;
  description: string;
}
