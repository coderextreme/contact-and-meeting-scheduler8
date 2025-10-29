import React, { useState } from 'react';
import type { Meeting, Contact } from '../types';
import { EditIcon, DeleteIcon, EmailIcon, CopyIcon, LaunchIcon } from './icons';

interface MeetingCardProps {
  meeting: Meeting;
  contacts: Contact[];
  onEdit: (meeting: Meeting) => void;
  onUpdate: (meeting: Meeting) => void;
  onDelete: (meetingId: string) => void;
  onComposeEmail: (meeting: Meeting) => void;
}

const MeetingCard: React.FC<MeetingCardProps> = ({ meeting, contacts, onEdit, onUpdate, onDelete, onComposeEmail }) => {
  const [isEditingTopic, setIsEditingTopic] = useState(false);
  const [topicValue, setTopicValue] = useState(meeting.topic);

  const participants = contacts.filter(c => meeting.participantIds.includes(c.id));
  const meetingDate = new Date(meeting.dateTime);

  const formattedDate = meetingDate.toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const formattedTime = meetingDate.toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
  });
  
  const isVirtualMeeting = ['URL', 'Zoom', 'Discord', 'Facebook Messenger'].includes(meeting.locationType);

  const copyLink = () => {
    navigator.clipboard.writeText(meeting.shareableLink);
    alert('Shareable link copied to clipboard!');
  };

  const handleTopicSave = () => {
    if (topicValue.trim() && topicValue !== meeting.topic) {
      onUpdate({ ...meeting, topic: topicValue.trim() });
    } else {
      setTopicValue(meeting.topic);
    }
    setIsEditingTopic(false);
  };
  
  const handleTopicKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleTopicSave();
    } else if (e.key === 'Escape') {
      setTopicValue(meeting.topic);
      setIsEditingTopic(false);
    }
  };
  
  const handleLaunch = () => {
    if (meeting.locationType === 'Discord') {
        window.electronAPI.launchDiscord(meeting.location);
    }
  };

  const actionButtonClasses = "flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-colors";
  const primaryActionClasses = `${actionButtonClasses} bg-primary text-white hover:bg-primary-dark`;
  const secondaryActionClasses = `${actionButtonClasses} bg-gray-200 dark:bg-gray-700 text-light-text dark:text-dark-text hover:bg-gray-300 dark:hover:bg-gray-600`;
  const iconButtonClasses = "p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-500 dark:text-gray-400 transition-colors";

  return (
    <div className="bg-light-card dark:bg-dark-card rounded-lg shadow-md border border-light-border dark:border-dark-border p-4 flex flex-col gap-4">
      <div className="flex justify-between items-start">
        <div className="flex-1 pr-2">
            {isEditingTopic ? (
                <input 
                    type="text"
                    value={topicValue}
                    onChange={(e) => setTopicValue(e.target.value)}
                    onBlur={handleTopicSave}
                    onKeyDown={handleTopicKeyDown}
                    autoFocus
                    className="text-xl font-bold bg-light-bg dark:bg-dark-bg border-b-2 border-primary focus:outline-none w-full text-light-text dark:text-dark-text"
                />
            ) : (
                <h3 
                    className="text-xl font-bold text-light-text dark:text-dark-text cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md px-1 -mx-1"
                    onClick={() => setIsEditingTopic(true)}
                    title="Click to edit topic"
                >
                    {meeting.topic}
                </h3>
            )}
          <p className="text-primary dark:text-primary-light font-semibold">{formattedDate}</p>
          <p className="text-gray-500 dark:text-gray-400">{formattedTime}</p>
        </div>
        <div className="flex-shrink-0 flex items-center gap-2">
            <button onClick={() => onEdit(meeting)} className={iconButtonClasses} title="Edit Meeting"><EditIcon /></button>
            <button onClick={() => onDelete(meeting.id)} className={`${iconButtonClasses} hover:bg-red-100 dark:hover:bg-red-900/50 text-red-500 dark:text-red-400`} title="Delete Meeting"><DeleteIcon /></button>
        </div>
      </div>
      
      <div>
        <h4 className="font-semibold text-sm text-light-text dark:text-dark-text mb-1">Location</h4>
        <p className="text-sm text-gray-600 dark:text-gray-300">{meeting.locationType}: <span className="font-medium text-primary dark:text-primary-light break-all">{meeting.location}</span></p>
      </div>

      <div>
        <h4 className="font-semibold text-sm text-light-text dark:text-dark-text mb-2">Participants ({participants.length})</h4>
        <div className="flex flex-wrap gap-2">
            {participants.map(p => (
                <span key={p.id} className="px-2 py-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 text-xs font-medium rounded-full">{p.name}</span>
            ))}
        </div>
      </div>
      
      <div>
        <h4 className="font-semibold text-sm text-light-text dark:text-dark-text mb-2">Shareable Link</h4>
        <div className="flex items-center gap-2 p-2 bg-gray-100 dark:bg-gray-800 rounded-md">
            <input type="text" readOnly value={meeting.shareableLink} className="flex-grow bg-transparent text-sm text-gray-600 dark:text-gray-400 focus:outline-none truncate" />
            <button onClick={copyLink} className="p-1.5 text-gray-500 hover:text-primary dark:hover:text-primary-light" title="Copy Link"><CopyIcon /></button>
        </div>
      </div>

      <div className="border-t border-light-border dark:border-dark-border pt-4 mt-auto flex flex-wrap gap-2 justify-end">
        {isVirtualMeeting && meeting.locationType === 'Discord' &&
            <button onClick={handleLaunch} className={primaryActionClasses}><LaunchIcon/>Launch</button>
        }
        {isVirtualMeeting && meeting.locationType !== 'Discord' &&
            <a href={meeting.location} target="_blank" rel="noopener noreferrer" className={primaryActionClasses}><LaunchIcon/>Launch</a>
        }
        <button onClick={() => onComposeEmail(meeting)} className={secondaryActionClasses}><EmailIcon/>Compose Email</button>
      </div>
    </div>
  );
};

export default MeetingCard;