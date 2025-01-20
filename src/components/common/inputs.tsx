'use client';

import * as React from 'react';
import * as Lucide from 'lucide-react';
// components
import { Badge } from '@/ui/badge';
import { Button } from '@/ui/button';
import { Input } from '@/ui/input';

interface TagFieldProps {
  onAdd: (value: string) => void;
  onRemove: (value: string) => void;
  values: string[];
  placeholder?: string;
}

export const TagField: React.FC<TagFieldProps> = ({
  onAdd,
  onRemove,
  values,
  placeholder = 'Enter a value',
}) => {
  const [inputValue, setInputValue] = React.useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.ctrlKey && e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      handleAdd();
    }
  };

  const handleAdd = () => {
    if (inputValue.trim()) {
      onAdd(inputValue.trim());
      setInputValue('');
    }
  };

  return (
    <div className="w-full flex flex-col flex-shrink gap-2">
      <div className="w-full inline-flex flex-row flex-nowrap items-center gap-2">
        <Input
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleInputKeyDown}
          placeholder={placeholder}
        />
        <Button
          className="ml-auto"
          onClick={handleAdd}
          size="icon"
          variant="secondary"
          type="button"
        >
          <Lucide.PlusIcon />
          <span className="sr-only">Add</span>
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {values.map((value, index) => (
          <Badge key={index} variant="secondary">
            {value}
            <Button
              variant="ghost"
              size="sm"
              className="ml-2 h-auto p-0 text-secondary-foreground"
              onClick={() => onRemove(value)}
            >
              <Lucide.X className="h-3 w-3" />
              <span className="sr-only">Remove</span>
            </Button>
          </Badge>
        ))}
      </div>
    </div>
  );
};
TagField.displayName = 'TagInputField';
