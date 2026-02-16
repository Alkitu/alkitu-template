import * as LucideIcons from 'lucide-react';
import {
  FaGoogle,
  FaFacebookF,
  FaLinkedinIn,
  FaInstagram,
  FaWhatsapp,
} from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';

// Alias adjustments for compatibility with existing categories and cleanup
const {
  ShapesIcon,
  TextIcon,
  createLucideIcon,
  icons,
  Icon: LucideIcon,
  default: LucideDefault,
  ...RestLucide
} = LucideIcons as any;

export const Icons = {
  ...RestLucide,
  // Restore Aliases
  Form: ShapesIcon,
  TextArea: TextIcon,
  // Explicit overrides or additions if needed
  ShapesIcon,
  TextIcon,
  // Social Media Icons
  Facebook: FaFacebookF,
  Linkedin: FaLinkedinIn,
  Google: FaGoogle,
  Twitter: FaXTwitter,
  Instagram: FaInstagram,
  WhatsApp: FaWhatsapp,
} as const;

export type Icon = keyof typeof Icons;

// Helper to get all icons for the selector
export const allIcons = Object.keys(Icons)
  .filter((key) => key !== 'lucide-react' && key !== 'default' && /^[A-Z]/.test(key))
  .map((key) => ({ name: key, icon: key }));

// Social Media Icons List
const socialIconsList = [
  'Facebook',
  'Linkedin',
  'Google',
  'Twitter',
  'Instagram',
  'WhatsApp',
];

export const iconLibraries = {
  Lucide: Object.keys(RestLucide)
    .filter((key) => {
      // Basic filtering
      if (
        key === 'lucide-react' ||
        key === 'default' ||
        !/^[A-Z]/.test(key) ||
        socialIconsList.includes(key)
      ) {
        return false;
      }

      // Filter out "Icon" suffix duplicates
      // If "ActivityIcon" exists, check if "Activity" also exists.
      // If both exist, we keep "Activity" and skip "ActivityIcon".
      if (key.endsWith('Icon')) {
        const baseName = key.slice(0, -4);
        if (Object.prototype.hasOwnProperty.call(RestLucide, baseName)) {
          return false;
        }
      }

      return true;
    })
    .map((key) => ({ name: key, icon: key })),
  Social: socialIconsList.map((key) => ({ name: key, icon: key })),
};

export const iconCategories = {
  Formulario: [
    { name: "Form", icon: "Form" },
    { name: "Text Input", icon: "TextIcon" },
    { name: "Number", icon: "Hash" },
    { name: "Date", icon: "CalendarDays" },
    { name: "Select", icon: "ListOrdered" },
    { name: "Multiselect", icon: "ListChecks" },
    { name: "Checkbox", icon: "CheckSquare" },
    { name: "Radio", icon: "Radio" },
    { name: "Textarea", icon: "TextArea" },
  ],
  Navegación: [
    { name: "ArrowRight", icon: "ArrowRight" },
    { name: "ArrowLeft", icon: "ArrowLeft" },
    { name: "ArrowUp", icon: "ArrowUp" },
    { name: "ArrowDown", icon: "ArrowDown" },
    { name: "ChevronDown", icon: "ChevronDown" },
    { name: "ExternalLink", icon: "ExternalLink" },
    { name: "Link", icon: "Link" },
  ],
  Acciones: [
    { name: "Plus", icon: "Plus" },
    { name: "Minus", icon: "Minus" },
    { name: "Check", icon: "Check" },
    { name: "X", icon: "X" },
    { name: "Download", icon: "Download" },
    { name: "Upload", icon: "Upload" },
    { name: "Save", icon: "Save" },
    { name: "Trash", icon: "Trash" },
    { name: "Edit", icon: "Edit" },
    { name: "Share", icon: "Share" },
  ],
  Notificaciones: [
    { name: "Bell", icon: "Bell" },
    { name: "Info", icon: "Info" },
    { name: "AlertCircle", icon: "AlertCircle" },
    { name: "AlertTriangle", icon: "AlertTriangle" },
    { name: "CheckCircle", icon: "CheckCircle" },
    { name: "XCircle", icon: "XCircle" },
  ],
  Contenido: [
    { name: "File", icon: "File" },
    { name: "FileText", icon: "FileText" },
    { name: "Image", icon: "Image" },
    { name: "Video", icon: "Video" },
    { name: "Music", icon: "Music" },
    { name: "Code", icon: "Code" },
  ],
  Usuario: [
    { name: "User", icon: "User" },
    { name: "Users", icon: "Users" },
    { name: "Settings", icon: "Settings" },
    { name: "Star", icon: "Star" },
    { name: "Heart", icon: "Heart" },
    { name: "Bookmark", icon: "Bookmark" },
  ],
  Contacto: [
    { name: "Mail", icon: "Mail" },
    { name: "Phone", icon: "Phone" },
    { name: "MapPin", icon: "MapPin" },
    { name: "Calendar", icon: "Calendar" },
    { name: "Clock", icon: "Clock" },
  ],
};
