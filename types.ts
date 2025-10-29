
export interface Socials {
  twitter?: string;
  linkedin?: string;
  github?: string;
  messenger?: string;
  discord?: string;
  zoom?: string;
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  timezone: string;
  socials: Socials;
}

export type LocationType = 'Physical' | 'URL' | 'Zoom' | 'Discord' | 'Facebook Messenger';

export interface Meeting {
  id: string;
  topic: string;
  dateTime: string;
  locationType: LocationType;
  location: string;
  participantIds: string[];
  shareableLink: string;
}

export type View = 'contacts' | 'meetings';
export type Theme = 'light' | 'dark';
