import React from 'react';
import type { Meeting, Contact } from '../types';
import MeetingCard from './MeetingCard';

interface MeetingListProps {
  meetings: Meeting[];
  contacts: Contact[];
  onScheduleMeeting: () => void;
  onEditMeeting: (meeting: Meeting) => void;
  onUpdateMeeting: (meeting: Meeting) => void;
  onDeleteMeeting: (meetingId: string) => void;
  onComposeEmail: (meeting: Meeting) => void;
  searchTerm: string;
}

const MeetingList: React.FC<MeetingListProps> = ({ meetings, contacts, onScheduleMeeting, onEditMeeting, onUpdateMeeting, onDeleteMeeting, onComposeEmail, searchTerm }) => {
  const sortedMeetings = [...meetings].sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-light-text dark:text-dark-text">Meetings ({meetings.length})</h2>
        <button
          onClick={onScheduleMeeting}
          disabled={contacts.length === 0}
          className="px-4 py-2 bg-primary text-white font-semibold rounded-lg shadow-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-light dark:focus:ring-offset-dark-bg transition-all disabled:bg-gray-400 disabled:cursor-not-allowed disabled:shadow-none"
          title={contacts.length === 0 ? "You must add a contact first" : "Schedule a new meeting"}
        >
          Schedule Meeting
        </button>
      </div>

      {meetings.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {sortedMeetings.map(meeting => (
            <MeetingCard
              key={meeting.id}
              meeting={meeting}
              contacts={contacts}
              onEdit={onEditMeeting}
              onUpdate={onUpdateMeeting}
              onDelete={onDeleteMeeting}
              onComposeEmail={onComposeEmail}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 px-4 border-2 border-dashed border-light-border dark:border-dark-border rounded-lg">
           {searchTerm ? (
            <>
              <h3 className="text-xl font-medium text-light-text dark:text-dark-text">No meetings found for "{searchTerm}"</h3>
              <p className="text-gray-500 dark:text-gray-400 mt-2">Try a different search term.</p>
            </>
          ) : (
            <>
              <h3 className="text-xl font-medium text-light-text dark:text-dark-text">No meetings scheduled.</h3>
              <p className="text-gray-500 dark:text-gray-400 mt-2">Time to plan your next conversation!</p>
              <button
                onClick={onScheduleMeeting}
                disabled={contacts.length === 0}
                className="mt-6 px-5 py-2.5 bg-secondary text-white font-semibold rounded-lg shadow-md hover:bg-secondary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary-light dark:focus:ring-offset-dark-bg transition-all disabled:bg-gray-400 disabled:cursor-not-allowed disabled:shadow-none"
                title={contacts.length === 0 ? "You must add a contact first" : "Schedule a new meeting"}
              >
                Schedule a Meeting
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default MeetingList;