import { useState } from 'react';
import { X } from 'lucide-react';
import { Badge } from './badge';

interface ChipInputProps {
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
}

export const ChipInput: React.FC<ChipInputProps> = ({
  value,
  onChange,
  placeholder,
}) => {
  const [inputValue, setInputValue] = useState('');

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      const newValue = inputValue.trim();
      if (!value.includes(newValue)) {
        onChange([...value, newValue]);
      }
      setInputValue('');
    } else if (e.key === 'Backspace' && !inputValue && value.length > 0) {
      onChange(value.slice(0, -1));
    }
  };

  const handleRemoveChip = (chipValue: string) => {
    onChange(value.filter((v) => v !== chipValue));
  };

  return (
    <div className="flex flex-wrap gap-2 p-2 border rounded-md">
      {value.map((chip) => (
        <Badge key={chip} variant="secondary">
          {chip}
          <button
            type="button"
            onClick={() => handleRemoveChip(chip)}
            className="ml-1 hover:text-destructive"
          >
            <X className="h-3 w-3" />
          </button>
        </Badge>
      ))}
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleInputKeyDown}
        className="flex-grow outline-none"
        placeholder={placeholder}
      />
    </div>
  );
};
