/*
  Appellation: content-section <module>
  Contrib: @FL03
*/
import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/utils';

const sectionVariants = cva('w-full', {
  variants: {
    flavor: {
      default: 'bg-background text-foreground border-none',
      inherit: 'bg-inherit text-inherit border-inherit',
      accent: 'bg-accent text-accent-foreground border-accent',
      primary: 'bg-primary text-primary-foreground border-primary',
      secondary: 'bg-secondary text-secondary-foreground border-secondary',
    },
    rounded: {
      default: 'rounded-none',
      sm: 'rounded-sm',
      md: 'rounded-md',
      lg: 'rounded-lg',
      xl: 'rounded-xl',
      full: 'rounded-full',
    },
    shadow: {
      default: 'shadow-none',
      inner: 'shadow-inner',
    },
    variant: {
      default: 'flex flex-col flex-1 gap-2 lg:gap-4',
      inline: 'flex flex-row gap-2 lg:gap-4',
      card: 'border border-muted-foreground',
    },
  },
  defaultVariants: {
    flavor: 'default',
    rounded: 'default',
    shadow: 'default',
    variant: 'default',
  },
});

type SectionVariants = VariantProps<typeof sectionVariants>;

// Section
export const Section = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & SectionVariants
>(({ className, flavor, rounded, shadow, variant, ...props }, ref) => {
  return (
    <section
      ref={ref}
      className={cn(
        sectionVariants({ flavor, rounded, shadow, variant }),
        className
      )}
      {...props}
    />
  );
});
Section.displayName = 'Section';

// SectionContent
export const SectionContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        'flex flex-col flex-1 w-full gap-2 lg:gap-4',
        className
      )}
      {...props}
    />
  );
});
SectionContent.displayName = 'SectionContent';

// SectionHeader
export const SectionHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return <div ref={ref} className={cn('w-full mb-2', className)} {...props} />;
});
SectionHeader.displayName = 'SectionHeader';

export const SectionFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return <div ref={ref} className={cn('flex items-center', className)} {...props} />;
});
SectionFooter.displayName = 'SectionFooter';

// SectionTitle
export const SectionTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => {
  return (
    <h1 ref={ref} className={cn('font-semibold', className)} {...props} />
  );
});
SectionTitle.displayName = 'SectionTitle';

// SectionDescription
export const SectionDescription = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(({ className, ...props }, ref) => {
  return (
    <span
      ref={ref}
      className={cn('text-muted-foreground text-sm', className)}
      {...props}
    />
  );
});
SectionDescription.displayName = 'SectionDescription';


export const PageSection: React.FC<React.ComponentProps<"div"> & SectionVariants> = ({ children, className, flavor, rounded, shadow, variant, ...props }) => {
  return (
    <Section className={cn('w-full', className)} flavor={flavor} rounded={rounded} shadow={shadow} variant={variant} {...props}>
      <SectionContent>
        {children}
      </SectionContent>
    </Section>
  );
}
PageSection.displayName = 'PageSection';