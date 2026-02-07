import React from 'react';
import { User, Phone } from 'lucide-react';
import { RequestClientCardMoleculeProps } from './RequestClientCardMolecule.types';

export const RequestClientCardMolecule: React.FC<RequestClientCardMoleculeProps> = ({
  client,
  clientType = 'Cliente Premium',
  className = '',
}) => {
  return (
    <div className={`p-4 bg-secondary/30 rounded-lg border border-border/50 flex items-center justify-between ${className}`}>
      <div className="flex items-center gap-3">
        {/* Avatar Circle */}
        <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
          <User className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-foreground leading-tight">
            {client.firstname} {client.lastname}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-white border border-border rounded text-muted-foreground/80">
              {clientType}
            </span>
          </div>
        </div>
      </div>
      
      {client.phone && (
        <a
          href={`tel:${client.phone}`}
          className="p-2.5 rounded-full bg-white border border-border shadow-sm hover:shadow-md transition-all active:scale-95 group"
          title={client.phone}
        >
          <Phone className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
        </a>
      )}
    </div>
  );
};
