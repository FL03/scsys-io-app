/*
  Appellation: settings-tabs <settings>
  Contrib: @FL03
*/
'use client';
import * as React from 'react';
// project
import { AuthProviderButtons } from '@/features/auth';
import { useProfile, ProfileForm } from '@/features/profiles';
import { cn } from '@/utils';
// components
import { ImagePicker } from '@/common/image-picker';
import { Button } from '@/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/ui/tabs';

// feature-specific
import { SettingsForm } from './settings-form';

type SettingsTabsProps = {
  defaultTab?: string;
} & React.ComponentProps<typeof Tabs>;

export const SettingsTabs: React.FC<SettingsTabsProps> = ({
  className,
  defaultTab = 'profile',
  ...props
}) => {
  const [tab, setTab] = React.useState(defaultTab);
  const { profile } = useProfile();

  return (
    <Tabs
      className={cn(
        'h-full',
        'relative flex flex-1 flex-col lg:flex-row gap-2 lg:gap-4',
        className
      )}
      orientation="horizontal"
      onValueChange={setTab}
      value={tab}
      {...props}
    >
      <div className="flex flex-1 flex-col gap-2 lg:gap-4">
        <TabsList className="h-full w-full items-start flex-1">
          <div className="flex flex-1 flex-row gap-2 items-center">
            <TabsTrigger
              asChild
              value="system"
              className="hover:underline focus:underline data-[state=active]:bg-primary/10  data-[state=active]:hover:bg-primary/20"
            >
              <Button
                className="w-full"
                variant="link"
                onClick={() => setTab('system')}
              >
                <span>System</span>
              </Button>
            </TabsTrigger>
            <TabsTrigger
              asChild
              className=" hover:underline focus:underline data-[state=active]:bg-primary/10  data-[state=active]:hover:bg-primary/20"
              value="profile"
            >
              <Button className="w-full" variant="link">
                <span>Profile</span>
              </Button>
            </TabsTrigger>
          </div>
        </TabsList>
        <TabsContent value="system" className="h-full w-full ">
          <div className="h-full flex flex-1 flex-col items-center">
            <SettingsForm />
          </div>
        </TabsContent>
        <TabsContent value="profile" className="h-full w-full">
          <div className="relative h-full flex flex-1 flex-col items-center gap-2 lg:gap-4">
            <ImagePicker showPreview selected={profile?.avatar_url} />

            <div className="mx-auto lg:ml-0">
              <AuthProviderButtons mode="link" className="" />
            </div>
            {profile && <ProfileForm values={profile} />}
          </div>
        </TabsContent>
      </div>
    </Tabs>
  );
};
SettingsTabs.displayName = 'SettingsTabs';
