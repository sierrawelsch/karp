import { cva } from 'class-variance-authority';

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-karp-primary focus-visible:ring-offset-2",
  {
    variants: {
      variant: {
        default: '!bg-karp-primary !text-white hover:!opacity-90',
        destructive:
          '!bg-karp-orange !text-white hover:!bg-karp-orange/90 focus-visible:ring-karp-orange',
        success:
          '!bg-karp-green !text-white hover:!bg-karp-green/90 focus-visible:ring-karp-green',
        warning:
          '!bg-karp-yellow !text-karp-font hover:!bg-karp-yellow/90 focus-visible:ring-karp-yellow',
        outline:
          'border border-karp-font/20 bg-karp-background shadow-sm hover:bg-karp-font/5 hover:text-karp-font',
        secondary: 'bg-karp-yellow text-karp-font hover:bg-karp-yellow/90',
        ghost: 'hover:bg-karp-font/10 hover:text-karp-font',
        link: 'text-karp-primary underline-offset-4 hover:underline hover:text-karp-orange',
      },
      size: {
        default: 'h-9 px-4 py-2 has-[>svg]:px-3',
        sm: 'h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5',
        lg: 'h-10 rounded-md px-6 has-[>svg]:px-4',
        icon: 'size-9',
        'icon-sm': 'size-8',
        'icon-lg': 'size-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);
