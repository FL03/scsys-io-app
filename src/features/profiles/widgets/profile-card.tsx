/*
  Appellation: profile-card <profile>
  Contrib: @FL03
*/
'use client';
// imports
import * as React from 'react';
import Link from 'next/link';
import { Settings2Icon } from 'lucide-react';
// project
import { cn } from '@/utils';
// components
import { Avatar, AvatarFallback, AvatarImage } from '@/ui/avatar';
import { Badge } from '@/ui/badge';
import { Button } from '@/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/ui/tooltip';
// feature-specific
import { useProfile } from '../provider';

export const ProfileAvatar: React.FC<
  React.ComponentProps<typeof Avatar> & { alt?: string; src?: string | null }
> = ({ alt = 'avatar', src, ...props }) => {
  return (
    <Avatar {...props}>
      <AvatarImage className="object-cover" src={src ?? ''} alt={alt} />
      <AvatarFallback>{alt}</AvatarFallback>
    </Avatar>
  );
};
ProfileAvatar.displayName = 'ProfileAvatar';

export const ProfileSettingsButton: React.FC<
  React.ComponentProps<typeof Button> & { href: import('@/types').Url }
> = ({ className, href, size = 'icon', variant = 'ghost', ...props }) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            asChild
            className={cn('my-auto', className)}
            size={size}
            variant={variant}
            {...props}
          >
            <Link href={href} about="Edit Profile">
              <Settings2Icon className="h-4 w-4" />
              <span className="sr-only">Edit Profile</span>
            </Link>
          </Button>
        </TooltipTrigger>
        <TooltipContent>Edit your account settings</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
ProfileSettingsButton.displayName = 'ProfileSettingsButton';

/**
 * @param {boolean} isOpen - whether the sidebar is open or not
 * @returns {JSX.Element} - on open, return the user's profile card, otherwise return the user's avatar
 */
export const ProfileCard: React.FC<
  React.ComponentProps<typeof Card> & {
    showContent?: boolean;
    isOpen?: boolean;
  }
> = ({ children, className, isOpen = true, showContent = false, ...props }) => {
  const { profile } = useProfile();
  //  if there is no profile, return null
  if (!profile) return null;

  const Avatar = () => (
    <ProfileAvatar alt={username} src={profile?.avatar_url ?? ''} />
  );

  // destructure the profile object
  const { status, username } = profile;
  //  return the user's profile card
  if (!isOpen) return <Avatar />;
  return (
    <Card className={cn('w-full', className)} {...props}>
      <CardHeader className="flex flex-row items-center gap-2">
        <Avatar />
        <div className="inline-block text-nowrap overflow-x-hidden gap-2">
          <CardTitle className="text-sm text-start">@{username}</CardTitle>
        </div>
        {status && (
          <Badge
            variant="outline"
            className="inline-flex flex-row flex-nowrap items-center gap-1 ml-auto"
          >
            <div className="rounded-full h-[10px] w-[10px] object-cover  bg-green-500" />
            <span className="mx-auto">{status}</span>
          </Badge>
        )}
      </CardHeader>
      {showContent && (
        <CardContent className="flex flex-col gap-2">{children}</CardContent>
      )}
    </Card>
  );
};
ProfileCard.displayName = 'ProfileCard';

export default ProfileCard;
