/*
  Appellation: commands <module>
  Contrib: @FL03
*/
'use client';
// imports
import * as React from 'react';
import { LucideCheck } from 'lucide-react';
import Link from 'next/link';
// components
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,

} from '@/ui/command';
import { Input } from '@/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/ui/popover';

const keymap = {
  open: 'cmd+j',
  data: []
}

const KB_TRIGGER_OPEN_ON = 'j';

export const ToolbarCombobox: React.FC = () => {
  const [open, setOpen] = React.useState<boolean>(false);
  const [value, setValue] = React.useState<string>('');

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'j' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [setOpen]);

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    event.preventDefault();
    setValue(event.target.value);
  }
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger>
        <Input
          className="inline-flex flex-1 max-w-sm border border-primary/10"
          placeholder={`Commands...\t(${keymap.open})`}
          value={value}
          onChange={handleInputChange}
        />
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput
            placeholder="Search..."
            value={value}
            onValueChange={setValue}
          />
          <CommandList>
            <CommandGroup heading="Navigation">
              <CommandItem
                asChild
                value="Shifts"
                onSelect={(currentValue) => {
                  setValue(currentValue === value ? '' : currentValue);
                  setOpen(false);
                }}
              >
                <Link href="/shifts">
                  <span>Shifts</span>
                  {value === 'Shifts' && <LucideCheck />}
                </Link>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
ToolbarCombobox.displayName = 'ToolbarCombobox';