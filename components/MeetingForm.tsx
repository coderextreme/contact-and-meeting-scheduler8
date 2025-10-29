import React, { useState, useEffect } from 'react';
import type { Contact, Meeting, LocationType } from '../types';
import Modal from './Modal';
import { generateMeetingLink } from '../utils';

interface MeetingFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (meeting: Meeting) => void;
  meetingToEdit: Meeting | null;
  contacts: Contact[];
}

const initialMeetingState: Omit<Meeting, 'id' | 'shareableLink'> = {
  topic: '',
  dateTime: '',
  locationType: 'Physical',
  location: '',
  participantIds: [],
};

const MeetingForm: React.FC<MeetingFormProps> = ({ isOpen, onClose, onSave, meetingToEdit, contacts }) => {
  const [meeting, setMeeting] = useState(initialMeetingState);
  const [selectedContacts, setSelectedContacts] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (meetingToEdit) {
      setMeeting({
        topic: meetingToEdit.topic,
        dateTime: meetingToEdit.dateTime.slice(0, 16), // Format for datetime-local
        locationType: meetingToEdit.locationType,
        location: meetingToEdit.location,
        participantIds: meetingToEdit.participantIds,
      });
      setSelectedContacts(new Set(meetingToEdit.participantIds));
    } else {
      setMeeting(initialMeetingState);
      setSelectedContacts(new Set());
    }
  }, [meetingToEdit, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'locationType') {
        const helperLink = generateMeetingLink(value as LocationType);
        // Fix: Explicitly set `locationType` and cast the value to `LocationType` to resolve TypeScript error.
        setMeeting(prev => ({ 
            ...prev,
            locationType: value as LocationType,
            location: helperLink || (value === 'Discord' ? '' : prev.location)
        }));
    } else {
        setMeeting(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleParticipantChange = (contactId: string) => {
    const newSelectedContacts = new Set(selectedContacts);
    if (newSelectedContacts.has(contactId)) {
      newSelectedContacts.delete(contactId);
    } else {
      newSelectedContacts.add(contactId);
    }
    setSelectedContacts(newSelectedContacts);
    setMeeting(prev => ({...prev, participantIds: Array.from(newSelectedContacts)}));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedContacts.size === 0) {
      alert('Please select at least one participant.');
      return;
    }
    
    onSave({
      ...meeting,
      id: meetingToEdit ? meetingToEdit.id : crypto.randomUUID(),
      participantIds: Array.from(selectedContacts),
      dateTime: new Date(meeting.dateTime).toISOString(),
      shareableLink: meetingToEdit ? meetingToEdit.shareableLink : `https://example.com/meet/${crypto.randomUUID()}`
    });
    onClose();
  };
  
  const locationTypes: LocationType[] = ['Physical', 'URL', 'Zoom', 'Discord', 'Facebook Messenger'];
  
  const getLocationPlaceholder = () => {
    switch(meeting.locationType) {
        case 'Physical': return 'e.g., Conference Room A';
        case 'URL': return 'e.g., https://meet.example.com';
        case 'Discord': return 'Paste Discord channel/group link here';
        default: return 'Meeting link will be here';
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={meetingToEdit ? 'Edit Meeting' : 'Schedule New Meeting'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="topic" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Topic</label>
          <input
            type="text"
            id="topic"
            name="topic"
            value={meeting.topic}
            onChange={handleChange}
            required
            className="mt-1 block w-full bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm text-light-text dark:text-dark-text"
          />
        </div>
        <div>
          <label htmlFor="dateTime" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Date & Time</label>
          <input
            type="datetime-local"
            id="dateTime"
            name="dateTime"
            value={meeting.dateTime}
            onChange={handleChange}
            required
            className="mt-1 block w-full bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm text-light-text dark:text-dark-text"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="locationType" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Location Type</label>
            <select
              id="locationType"
              name="locationType"
              value={meeting.locationType}
              onChange={handleChange}
              className="mt-1 block w-full bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm text-light-text dark:text-dark-text"
            >
              {locationTypes.map(lt => <option key={lt} value={lt}>{lt}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Location Details</label>
            <input
              type="text"
              id="location"
              name="location"
              value={meeting.location}
              onChange={handleChange}
              required
              placeholder={getLocationPlaceholder()}
              className="mt-1 block w-full bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm text-light-text dark:text-dark-text"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Participants</label>
          <div className="mt-2 p-3 max-h-48 overflow-y-auto border border-light-border dark:border-dark-border rounded-md bg-light-bg dark:bg-dark-bg">
            {contacts.length > 0 ? (
              <ul className="space-y-2">
                {contacts.map(contact => (
                  <li key={contact.id} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`contact-${contact.id}`}
                      checked={selectedContacts.has(contact.id)}
                      onChange={() => handleParticipantChange(contact.id)}
                      className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                    />
                    <label htmlFor={`contact-${contact.id}`} className="ml-3 text-sm text-light-text dark:text-dark-text">
                      {contact.name} <span className="text-gray-500">({contact.email})</span>
                    </label>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500">No contacts available. Please add a contact first.</p>
            )}
          </div>
        </div>
        <div className="flex justify-end gap-3 pt-4">
          <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 dark:bg-gray-600 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors">Cancel</button>
          <button type="submit" className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark shadow transition-colors" disabled={contacts.length === 0}>Save Meeting</button>
        </div>
      </form>
    </Modal>
  );
};

export default MeetingForm;