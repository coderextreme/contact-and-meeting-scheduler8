import React, { useState, useEffect } from 'react';
import type { Contact, Socials } from '../types';
import { TIMEZONES } from '../constants';
import Modal from './Modal';

interface ContactFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (contact: Contact) => void;
  contactToEdit: Contact | null;
}

const initialSocials: Socials = {
  twitter: '',
  linkedin: '',
  github: '',
  messenger: '',
  discord: '',
  zoom: '',
};

const initialContactState: Omit<Contact, 'id'> = {
  name: '',
  email: '',
  timezone: 'America/New_York',
  socials: initialSocials,
};

const ContactForm: React.FC<ContactFormProps> = ({ isOpen, onClose, onSave, contactToEdit }) => {
  const [contact, setContact] = useState(initialContactState);

  useEffect(() => {
    if (contactToEdit) {
      setContact(contactToEdit);
    } else {
      setContact(initialContactState);
    }
  }, [contactToEdit, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setContact(prev => ({ ...prev, [name]: value }));
  };

  const handleSocialChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setContact(prev => ({
      ...prev,
      socials: { ...prev.socials, [name]: value },
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...contact,
      id: contactToEdit ? contactToEdit.id : crypto.randomUUID(),
    });
    onClose();
  };

  const renderSocialInput = (name: keyof Socials, placeholder: string, type: string = "text", helpText?: string) => (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">{name}</label>
      <input
        type={type}
        id={name}
        name={name}
        value={contact.socials[name] || ''}
        onChange={handleSocialChange}
        placeholder={placeholder}
        className="mt-1 block w-full bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm text-light-text dark:text-dark-text"
      />
      {helpText && <p className="text-xs text-gray-500 mt-1">{helpText}</p>}
    </div>
  );
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={contactToEdit ? 'Edit Contact' : 'Add New Contact'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={contact.name}
            onChange={handleChange}
            required
            className="mt-1 block w-full bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm text-light-text dark:text-dark-text"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
          <input
            type="email"
            id="email"
            name="email"
            value={contact.email}
            onChange={handleChange}
            required
            className="mt-1 block w-full bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm text-light-text dark:text-dark-text"
          />
        </div>
        <div>
          <label htmlFor="timezone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Timezone</label>
          <select
            id="timezone"
            name="timezone"
            value={contact.timezone}
            onChange={handleChange}
            required
            className="mt-1 block w-full bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm text-light-text dark:text-dark-text"
          >
            {TIMEZONES.map(tz => <option key={tz} value={tz}>{tz}</option>)}
          </select>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {renderSocialInput("twitter", "Username")}
            {renderSocialInput("linkedin", "Profile URL", "url")}
            {renderSocialInput("github", "Username")}
            {renderSocialInput("messenger", "Username (for m.me links)")}
            {renderSocialInput("discord", "User ID (e.g., 12345...)", "text", "Enable Developer Mode, right-click user, and 'Copy User ID'.")}
            {renderSocialInput("zoom", "Personal Meeting ID or link")}
        </div>
        <div className="flex justify-end gap-3 pt-4">
          <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 dark:bg-gray-600 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors">Cancel</button>
          <button type="submit" className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark shadow transition-colors">Save Contact</button>
        </div>
      </form>
    </Modal>
  );
};

export default ContactForm;