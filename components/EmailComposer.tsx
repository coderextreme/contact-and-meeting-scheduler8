import React, { useState, useEffect } from 'react';
import type { Meeting, Contact } from '../types';
import Modal from './Modal';
import { generateEmailInvitation } from '../services/geminiService';
import { CopyIcon } from './icons';

interface EmailComposerProps {
  isOpen: boolean;
  onClose: () => void;
  meeting: Meeting | null;
  contacts: Contact[];
}

const EmailComposer: React.FC<EmailComposerProps> = ({ isOpen, onClose, meeting, contacts }) => {
  const [emailBody, setEmailBody] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    if (isOpen && meeting) {
      const generateEmail = async () => {
        setIsLoading(true);
        setError(null);
        setEmailBody('');
        try {
          const participants = contacts.filter(c => meeting.participantIds.includes(c.id));
          if (participants.length > 0) {
            const generatedBody = await generateEmailInvitation(meeting, participants);
            setEmailBody(generatedBody);
          } else {
             setEmailBody('No participants selected for this meeting.');
          }
        } catch (err) {
          console.error("Failed to generate email body:", err);
          setError('Could not generate the email body. Please try again.');
          setEmailBody('Failed to generate email content.');
        } finally {
          setIsLoading(false);
        }
      };

      generateEmail();
    }
  }, [isOpen, meeting, contacts]);

  const handleCopy = () => {
    navigator.clipboard.writeText(emailBody);
    alert('Email body copied to clipboard!');
  };

  const participants = meeting ? contacts.filter(c => meeting.participantIds.includes(c.id)) : [];
  const recipientEmails = participants.map(p => p.email).join(', ');

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Compose Email for: ${meeting?.topic || ''}`}>
      <div className="space-y-4">
        <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">To:</label>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 p-2 bg-light-bg dark:bg-dark-bg rounded-md">{recipientEmails}</p>
        </div>
        <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Subject:</label>
            <p className="mt-1 text-sm text-gray-800 dark:text-gray-200 font-semibold p-2 bg-light-bg dark:bg-dark-bg rounded-md">Invitation: {meeting?.topic}</p>
        </div>
        <div>
          <div className="flex justify-between items-center">
            <label htmlFor="emailBody" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Body</label>
            <button onClick={handleCopy} className="text-sm flex items-center gap-1 text-primary dark:text-primary-light hover:underline" disabled={isLoading || !!error}>
                <CopyIcon className="w-4 h-4" /> Copy
            </button>
          </div>
          <div className="mt-1 relative">
            {isLoading && (
              <div className="absolute inset-0 bg-light-card/70 dark:bg-dark-card/70 flex items-center justify-center rounded-md">
                <p className="text-light-text dark:text-dark-text">Generating with Gemini...</p>
              </div>
            )}
            <textarea
              id="emailBody"
              rows={12}
              value={emailBody}
              onChange={(e) => setEmailBody(e.target.value)}
              className="w-full bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border rounded-md shadow-sm p-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm text-light-text dark:text-dark-text"
              placeholder="Email content will be generated here..."
            />
            {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
          </div>
        </div>
        <div className="flex justify-end gap-3 pt-4">
          <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 dark:bg-gray-600 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors">Close</button>
          <a
            href={`mailto:${recipientEmails}?subject=Invitation: ${encodeURIComponent(meeting?.topic || '')}&body=${encodeURIComponent(emailBody)}`}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark shadow transition-colors"
          >
            Open in Email Client
          </a>
        </div>
      </div>
    </Modal>
  );
};

export default EmailComposer;
