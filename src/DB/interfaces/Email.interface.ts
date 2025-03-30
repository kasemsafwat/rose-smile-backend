export interface IEmail {
  from?: string;
  to: string | string[];
  subject?: string;
  text?: string;
  html: string;
  message: string;
}
