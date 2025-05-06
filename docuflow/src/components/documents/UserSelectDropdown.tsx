import { useState } from 'react';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export default function UserSelectDropdown({
  users,
  selectedUserId,
  onChange,
  placeholder = 'Select user',
}) {
  const [open, setOpen] = useState(false);

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const selectedUser = users.find((user) => user.user_id === selectedUserId);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {selectedUser ? (
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6 text-sm">
                <AvatarFallback className="bg-teal-100 text-teal-700">
                  {getInitials(selectedUser.name + ' ' + selectedUser.surname)}
                </AvatarFallback>
              </Avatar>
              <span>{selectedUser.name + ' ' + selectedUser.surname}</span>
            </div>
          ) : (
            <span className="text-gray-500">{placeholder}</span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput placeholder="Search user..." />
          <CommandEmpty>No user found.</CommandEmpty>
          <CommandGroup className="max-h-64 overflow-y-auto">
            {users.map((user) => (
              <CommandItem
                key={user.user_id}
                value={user.user_id}
                onSelect={() => {
                  onChange(user.user_id, user.name + ' ' + user.surname);
                  setOpen(false);
                }}
              >
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6 text-sm">
                    <AvatarFallback className="bg-teal-100 text-teal-700">
                      {getInitials(user.name + ' ' + user.surname)}
                    </AvatarFallback>
                  </Avatar>
                  <span>{user.name + ' ' + user.surname}</span>
                </div>
                <Check
                  className={cn(
                    'ml-auto h-4 w-4',
                    selectedUserId === user.user_id ? 'opacity-100' : 'opacity-0'
                  )}
                />
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
