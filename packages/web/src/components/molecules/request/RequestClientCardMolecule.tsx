import React from 'react';
import { Phone } from 'lucide-react';
import { UserAvatar } from '@/components/molecules-alianza/UserAvatar';
import { RequestClientCardMoleculeProps } from './RequestClientCardMolecule.types';

export const RequestClientCardMolecule: React.FC<
  RequestClientCardMoleculeProps
> = ({ client, clientType = 'Cliente Premium', className = '' }) => {
  return (
    <div
      className={`relative overflow-hidden p-5 bg-card rounded-xl border shadow-sm flex items-center justify-between transition-all hover:shadow-md ${className}`}
    >
      <div className="absolute top-0 left-0 w-1 h-full bg-linear-to-b from-primary to-primary/40" />
      <div className="flex items-center gap-4 pl-2">
        {/* Avatar Circle */}
        <UserAvatar
          name={client.firstname}
          lastName={client.lastname}
          image={client.image || undefined}
          size="lg"
          className="ring-2 ring-background"
        />
        <div>
          <h3 className="text-base font-bold text-foreground tracking-tight leading-tight">
            {client.firstname} {client.lastname}
          </h3>
          <div className="flex items-center gap-2 mt-1.5">
            <span className="px-2 py-0.5 text-[9px] font-black uppercase tracking-widest bg-secondary text-secondary-foreground rounded-md">
              {clientType}
            </span>
          </div>
        </div>
      </div>

      {client.phone && (
        <div className="flex items-center gap-3">
          <span className="text-base font-bold text-foreground tracking-tight">
            {client.phone}
          </span>
          <a
            href={`tel:${client.phone}`}
            className="p-3 rounded-full bg-green-50 border border-green-200 hover:bg-green-100 shadow-sm hover:shadow transition-all active:scale-95 group"
            title={client.phone}
          >
            <Phone className="h-5 w-5 text-green-600 group-hover:text-green-700 transition-colors" />
          </a>
        </div>
      )}
    </div>
  );
};
