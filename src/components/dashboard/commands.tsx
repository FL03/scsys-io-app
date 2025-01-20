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
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/ui/command';
import { Input } from '@/ui/input';
import { DialogDescription, DialogHeader, DialogTitle } from '@/ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/ui/popover';

const keymap = {
  open: 'cmd+shift+k',
  data: []
}

const KB_TRIGGER_OPEN_ON = 'cmd+alt+k';


export function ToolbarCombobox() {
  const [open, setOpen] = React.useState<boolean>(false);
  const [value, setValue] = React.useState<string>('');

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === KB_TRIGGER_OPEN_ON && (e.metaKey || e.ctrlKey)) {
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
          autoFocus
          className="inline-flex flex-1 max-w-sm border border-primary/10"
          placeholder={`Search...\t(${keymap.open})`}
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
                  {value === 'Shifts' && <LucideCheck/>}
                </Link>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export const PlatformCommandMenu: React.FC<
  React.ComponentProps<typeof CommandDialog>
> = ({ children, ...props }) => {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  return (
    <CommandDialog open={open} onOpenChange={setOpen} {...props}>
      <DialogHeader className="sr-only">
        <DialogTitle>Commands</DialogTitle>
        <DialogDescription>Search and execute commands</DialogDescription>
      </DialogHeader>
      <PlatformCommand>
        {children}
      </PlatformCommand>
    </CommandDialog>
  );
};
PlatformCommandMenu.displayName = 'PlatformCommandMenu';


export const PlatformCommand: React.FC<
  React.ComponentProps<typeof Command>
> = ({ children, ...props }) => {

  return (
    <Command {...props}>
      <CommandInput
        placeholder="Search commands..."
        
      />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Navigation">
          <CommandItem asChild>
            <Link href="/shifts">Shifts</Link>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        {children}
      </CommandList>
    </Command>
  );
};
PlatformCommand.displayName = 'PlatformCommand';

