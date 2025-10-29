import type { LocationType } from './types';

/**
 * Generates a helpful starting URL for creating a meeting on a given platform.
 * This does not create the meeting, but directs the user to the correct page.
 * Discord links must be manually created and pasted by the user.
 * @param locationType The type of meeting location.
 * @returns A URL string or null if no helper link is available.
 */
export const generateMeetingLink = (locationType: LocationType): string | null => {
  switch (locationType) {
    case 'Zoom':
      // A link to the schedule page is a good helper.
      return 'https://zoom.us/meeting/schedule';
    case 'Facebook Messenger':
       // Link to create a new conversation.
      return 'https://www.messenger.com/new';
    default:
      // Physical, URL, and Discord do not have automated helper links.
      return null;
  }
};
