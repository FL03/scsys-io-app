/*
  Appellation: shift-context <module>
  Contrib: @FL03
*/
'use client';
// components
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuTrigger,
} from '@/ui/context-menu';
import { DeleteShiftButton, EditShiftButton } from './shift-buttons';

export const ShiftContextMenu: React.FC<
  React.ComponentProps<typeof ContextMenuTrigger> & { itemId?: string }
> = ({ itemId, ...props }) => {
  return (
    <ContextMenu dir="ltr">
      <ContextMenuTrigger {...props} />
      <ContextMenuContent className="w-64">
        <ContextMenuGroup>
          <ContextMenuLabel inset>Actions</ContextMenuLabel>
          <ContextMenuItem inset>
            <EditShiftButton className="w-full px-1 justify-start" variant="ghost" itemId={itemId}/>
          </ContextMenuItem>
          <ContextMenuItem inset>
            <DeleteShiftButton className="w-full px-1 justify-start bg-destructive/20" />
          </ContextMenuItem>
        </ContextMenuGroup>
      </ContextMenuContent>
    </ContextMenu>
  );
};
ShiftContextMenu.displayName = 'ShiftContextMenu';

export default ShiftContextMenu;
