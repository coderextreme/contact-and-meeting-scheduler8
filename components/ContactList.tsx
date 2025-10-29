import React from 'react';
import type { Contact } from '../types';
import ContactCard from './ContactCard';

interface ContactListProps {
  contacts: Contact[];
  onAddContact: () => void;
  onEditContact: (contact: Contact) => void;
  onDeleteContact: (contactId: string) => void;
  searchTerm: string;
}

const ContactList: React.FC<ContactListProps> = ({ contacts, onAddContact, onEditContact, onDeleteContact, searchTerm }) => {
  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-light-text dark:text-dark-text">Contacts ({contacts.length})</h2>
        <button
          onClick={onAddContact}
          className="px-4 py-2 bg-primary text-white font-semibold rounded-lg shadow-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-light dark:focus:ring-offset-dark-bg transition-all"
        >
          Add Contact
        </button>
      </div>

      {contacts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {contacts.map(contact => (
            <ContactCard
              key={contact.id}
              contact={contact}
              onEdit={onEditContact}
              onDelete={onDeleteContact}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 px-4 border-2 border-dashed border-light-border dark:border-dark-border rounded-lg">
          {searchTerm ? (
            <>
              <h3 className="text-xl font-medium text-light-text dark:text-dark-text">No contacts found for "{searchTerm}"</h3>
              <p className="text-gray-500 dark:text-gray-400 mt-2">Try a different search term.</p>
            </>
          ) : (
            <>
              <h3 className="text-xl font-medium text-light-text dark:text-dark-text">No contacts yet!</h3>
              <p className="text-gray-500 dark:text-gray-400 mt-2">Get started by adding your first contact.</p>
              <button
                onClick={onAddContact}
                className="mt-6 px-5 py-2.5 bg-secondary text-white font-semibold rounded-lg shadow-md hover:bg-secondary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary-light dark:focus:ring-offset-dark-bg transition-all"
              >
                Add a Contact
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ContactList;