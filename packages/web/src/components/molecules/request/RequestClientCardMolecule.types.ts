export interface RequestClientCardMoleculeProps {
  client: {
    firstname: string;
    lastname: string;
    email: string;
    phone?: string | null;
    company?: string | null;
    image?: string | null;
  };
  clientType?: string; // e.g., "Cliente Premium"
  className?: string;
}
