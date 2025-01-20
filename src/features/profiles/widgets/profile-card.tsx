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
import { sitemap } from '@/config';
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
import { Profile } from '../types';
import { useProfile } from '../provider';

export const ProfileAvatar: React.FC<
  React.ComponentProps<typeof Avatar> & { value: Partial<Profile> }
> = ({ value: { avatar_url = '', username }, className, ...props }) => {
  return (
    <Avatar className={cn('', className)} {...props}>
      <AvatarImage
        className="object-cover"
        src={avatar_url ?? ''}
        alt={`@${username}`}
      />
      <AvatarFallback>{username}</AvatarFallback>
    </Avatar>
  );
};
ProfileAvatar.displayName = 'ProfileAvatar';

export const ProfileSettingsButton: React.FC<
  React.ComponentProps<typeof Button> & { username: string }
> = ({ className, size = 'icon', variant = 'ghost', username, ...props }) => {
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
            <Link href={sitemap.pages.profile.route(username, 'settings')}>
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

type ProfileCardProps = {
  showContent?: boolean;
  isOpen?: boolean;
} & React.ComponentProps<typeof Card>;
/**
 * @param {boolean} isOpen - whether the sidebar is open or not
 * @returns {JSX.Element} - on open, return the user's profile card, otherwise return the user's avatar
 */
export const ProfileCard: React.FC<ProfileCardProps> = ({
  children,
  className,
  isOpen = true,
  showContent = false,
  ...props
}) => {
  const { profile } = useProfile();
  //  if there is no profile, return null
  if (!profile) return null;

  //  onClosed collapse the profile card down into the user's avatar
  if (isOpen === false) return <ProfileAvatar value={profile} />;

  // destructure the profile object
  const { bio, role, username } = profile;
  //  return the user's profile card
  return (
    <Card className={cn('w-full', className)} {...props}>
      <CardHeader className="flex flex-row flex-nowrap items-center gap-2">
        <ProfileAvatar value={profile} />
        <div className="inline-flex flex-1 flex-col text-nowrap gap-2">
          <CardTitle>@{username}</CardTitle>
          {bio && (
            <CardDescription className="text-xs overflow-x-hidden">
              {bio}
            </CardDescription>
          )}
        </div>
        <div className="ml-auto">
          <Badge variant="outline">{role}</Badge>
        </div>
      </CardHeader>
      {showContent && (
        <CardContent className="flex flex-col gap-2">{children}</CardContent>
      )}
    </Card>
  );
};
ProfileCard.displayName = 'ProfileCard';

export default ProfileCard;
