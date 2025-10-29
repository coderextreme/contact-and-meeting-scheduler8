
import React from 'react';
import type { Contact } from '../types';
import { EditIcon, DeleteIcon, TwitterIcon, LinkedinIcon, GithubIcon, MessengerIcon, DiscordIcon, ZoomIcon } from './icons';

interface ContactCardProps {
  contact: Contact;
  onEdit: (contact: Contact) => void;
  onDelete: (contactId: string) => void;
}

const SocialLink: React.FC<{ Icon: React.FC<{ className?: string }>, href: string, label: string }> = ({ Icon, href, label }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" title={label} className="text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary-light transition-colors">
        <Icon className="w-5 h-5" />
    </a>
);

const ContactCard: React.FC<ContactCardProps> = ({ contact, onEdit, onDelete }) => {
  const { socials } = contact;
  return (
    <div className="bg-light-card dark:bg-dark-card rounded-lg shadow-md border border-light-border dark:border-dark-border p-4 flex flex-col justify-between transition-shadow hover:shadow-xl">
      <div>
        <div className="flex justify-between items-start">
            <div className='flex-1 pr-2'>
                <h3 className="text-lg font-bold text-light-text dark:text-dark-text truncate">{contact.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{contact.email}</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{contact.timezone}</p>
            </div>
            <div className="flex-shrink-0 flex items-center gap-2">
            <button onClick={() => onEdit(contact)} className="p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-500 dark:text-gray-400 transition-colors" title="Edit Contact">
                <EditIcon />
            </button>
            <button onClick={() => onDelete(contact.id)} className="p-1.5 rounded-full hover:bg-red-100 dark:hover:bg-red-900/50 text-red-500 dark:text-red-400 transition-colors" title="Delete Contact">
                <DeleteIcon />
            </button>
            </div>
        </div>
        
        <div className="mt-4 flex flex-wrap items-center gap-4">
            {socials.twitter && <SocialLink Icon={TwitterIcon} href={`https://twitter.com/${socials.twitter}`} label="Twitter" />}
            {socials.linkedin && <SocialLink Icon={LinkedinIcon} href={socials.linkedin} label="LinkedIn" />}
            {socials.github && <SocialLink Icon={GithubIcon} href={`https://github.com/${socials.github}`} label="GitHub" />}
            {socials.messenger && <SocialLink Icon={MessengerIcon} href={`https://m.me/${socials.messenger}`} label="Messenger" />}
            {socials.discord && <SocialLink Icon={DiscordIcon} href="#" label={`Discord: ${socials.discord}`} />}
            {socials.zoom && <SocialLink Icon={ZoomIcon} href={socials.zoom.startsWith('http') ? socials.zoom : `https://zoom.us/j/${socials.zoom}`} label="Zoom" />}
        </div>
      </div>
    </div>
  );
};

export default ContactCard;
