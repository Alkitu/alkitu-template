import React from 'react';
import { User, Phone } from 'lucide-react';
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
        <div className="w-12 h-12 rounded-full bg-primary/5 border border-primary/10 shadow-inner flex items-center justify-center ring-2 ring-background">
          <User className="h-5 w-5 text-primary/80" />
        </div>
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
        <a
          href={`tel:${client.phone}`}
          className="p-3 rounded-full bg-background border shadow-sm hover:shadow hover:bg-muted transition-all active:scale-95 group"
          title={client.phone}
        >
          <Phone className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
        </a>
      )}
    </div>
  );
};
