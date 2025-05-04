import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

export default function TagInput({ value = [], onChange }) {
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag();
    }
  };

  const addTag = () => {
    const trimmedValue = inputValue.trim();
    if (trimmedValue && !value.includes(trimmedValue)) {
      const newTags = [...value, trimmedValue];
      onChange(newTags);
      setInputValue('');
    }
  };

  const removeTag = (tagToRemove) => {
    const newTags = value.filter((tag) => tag !== tagToRemove);
    onChange(newTags);
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1">
        {value.map((tag, index) => (
          <Badge key={index} variant="secondary" className="px-2 py-1 text-xs">
            {tag}
            <button
              type="button"
              className="ml-1 text-gray-500 hover:text-gray-700"
              onClick={() => removeTag(tag)}
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      </div>
      <div className="flex gap-2">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={addTag}
          placeholder="Add tag (press Enter)"
          className="flex-1"
        />
      </div>
    </div>
  );
}
