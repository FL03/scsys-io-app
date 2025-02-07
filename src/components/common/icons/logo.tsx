/*
  Appellation: logo <icons>
  Contrib: @FL03
*/
import * as React from 'react';

type LogoProps = {
  background?: string;
  color?: string;
  height?: number;
  width?: number;
};

export const AppLogo = React.forwardRef<
  SVGSVGElement,
  React.HTMLAttributes<SVGSVGElement> & LogoProps
>(
  (
    {
      background = 'white',
      color = 'black',
      height = 32,
      width = 32,
      ...props
    },
    ref
  ) => {
    return (
      <svg
        ref={ref}
        fill={background}
        role="img"
        stroke={color}
        height={height}
        viewBox="0 0 32 32"
        width={width}
        xmlns="http://www.w3.org/2000/svg"
        {...props}
      >
        <rect rx="16" width="100%" height="100%" fill={background} />
        <path
          clipRule="evenodd"
          fill={color}
          fillRule="evenodd"
          stroke={color}
          d="M17.6482 10.1305L15.8785 7.02583L7.02979 22.5499H10.5278L17.6482 10.1305ZM19.8798 14.0457L18.11 17.1983L19.394 19.4511H16.8453L15.1056 22.5499H24.7272L19.8798 14.0457Z"
        />
      </svg>
    );
  }
);
AppLogo.displayName = 'AppLogo';

export default AppLogo;
