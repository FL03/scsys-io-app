/*
  Appellation: file-selector <module>
  Contrib: @FL03
*/
'use client';
import * as React from 'react';
import { X, Upload } from 'lucide-react';
import { ColorRing } from 'react-loader-spinner';
import Image from 'next/image';
import { Button } from '@/ui/button';
import { Input } from '@/ui/input';
import { Label } from '@/ui/label';
import { uploadAvatar } from '@/features/profiles/utils/server';
import { Nullish } from '@/types';
import { toast } from 'sonner';

type ImagePickerProps = {
  showPreview?: boolean;
  onFileSubmit?: React.MouseEventHandler<HTMLButtonElement>;
  selected?: string | null;
} & React.ComponentProps<typeof Input>;

export const ImagePicker: React.FC<ImagePickerProps> = ({
  showPreview = false,
  selected: selectedProp = '',
}) => {
  const [selected, setSelected] = React.useState<Nullish<File>>(null);
  const [previewUrl, setPreviewUrl] = React.useState<string>(selectedProp);
  const [isUploading, setIsUploading] = React.useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelected(file);
    }
  };

  const handleClear = () => {
    setSelected(null);
    setPreviewUrl('');
  };

  const handleUpload = async () => {
    if (!selected) return;
    setIsUploading(true);
    try {
      const url = await uploadAvatar(selected);
      if (url) {
        toast.success('Avatar uploaded successfully');
        setPreviewUrl(url);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsUploading(false);
    }
  }
  const withPreview = showPreview && previewUrl.trim() !== '';


  return (
    <div className="w-full inline-flex flex-row flex-wrap items-center justify-items-start gap-2 lg:gap-4">
      <div className="flex-shrink">
        {withPreview && (
          <div className="relative h-40 w-40">
            <Image
              fill
              loader={({ src }) => new URL(src).toString()}
              alt="Avatar preview"
              src={previewUrl}
              className="rounded-full object-cover"
            />
          </div>
        )}
      </div>
      <div className="w-full flex flex-1 flex-col gap-2 lg:gap-4">
        <Label htmlFor="avatar" className="text-muted-foreground text-nowrap">
          Select Avatar Image
        </Label>
        <div className="inline-flex flex-row flex-nowrap items-center gap-2 lg:gap-4">
          <Input
            id="avatar"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full"
            defaultValue={selected?.name}
            placeholder='Select an image'
          />
          <Button
            variant="secondary"
            size="icon"
            onClick={() => {
              handleClear();
            }}
            disabled={!selected || isUploading || !withPreview}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Clear</span>
          </Button>
        </div>
        <div className="bottom-0 flex flex-row flex-nowrap items-center gap-2 lg:gap-4">
          <Button
            className="w-full"
            disabled={!selected || isUploading}
            onClick={handleUpload}
          >
            {isUploading ? (
              <ColorRing/>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                <span>Upload Avatar</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
