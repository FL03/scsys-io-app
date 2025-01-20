/*
  Appellation: file-selector <module>
  Contrib: @FL03
*/
'use client';
import * as React from 'react';
import { X, Upload } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/ui/button';
import { Input } from '@/ui/input';
import { Label } from '@/ui/label';
import { uploadAvatar } from '@/features/profiles/utils/server';
import { Nullish } from '@/types';
import { toast } from 'sonner';

type ImagePickerProps = {
  showPreview?: boolean;
  onImageSelect?: (url: string) => void;
  selected?: string | null;
} & React.ComponentProps<typeof Input>;

export const ImagePicker: React.FC<ImagePickerProps> = ({
  showPreview = false,
  selected: selectedProp,
}) => {
  const [selectedImage, setSelectedImage] = React.useState<Nullish<File>>(null);
  const [previewUrl, setPreviewUrl] =
    React.useState<string>(selectedProp ?? '');
  const [isUploading, setIsUploading] = React.useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleUpload = async () => {
    if (selectedImage) {
      setIsUploading(true);
      const url = await uploadAvatar(selectedImage);

      if (url) {
        setPreviewUrl(url);
      }

      setIsUploading(false);
      toast.success('Image uploaded successfully');
    }
  };

  const handleClear = () => {
    setSelectedImage(null);
    setPreviewUrl('');
  };

  return (
    <div className="inline-flex flex-col gap-2 lg:gap-4 items-center">
      <section className="w-full">
        <Label htmlFor="avatar" className="text-muted-foreground">
          Select Avatar Image
        </Label>
      </section>
      <div className="flex items-center space-x-4">
        <Input
          id="avatar"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="w-full"
        />
        {previewUrl && (
          <Button variant="outline" size="icon" onClick={handleClear}>
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      {showPreview && previewUrl !== '' && (
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
      <Button
        className="w-full"
        disabled={!selectedImage || isUploading}
        onClick={handleUpload}
      >
        {isUploading ? (
          'Uploading...'
        ) : (
          <>
            <Upload className="mr-2 h-4 w-4" />
            <span>Upload Avatar</span>
          </>
        )}
      </Button>
    </div>
  );
};
