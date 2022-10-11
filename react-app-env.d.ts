/// <reference types="react" />

declare module '*.avif' {
  const src: number;
  export default src;
}

declare module '*.bmp' {
  const src: number;
  export default src;
}

declare module '*.gif' {
  const src: number;
  export default src;
}

declare module '*.jpg' {
  const src: number;
  export default src;
}

declare module '*.jpeg' {
  const src: number;
  export default src;
}

declare module '*.png' {
  const src: number;
  export default src;
}

declare module '*.webp' {
  const src: number;
  export default src;
}

declare module '*.svg' {
  import * as React from 'react';

  const ReactComponent: React.FunctionComponent<
    React.SVGProps<SVGSVGElement> & {title?: string}
  >;

  export const src: string;
  export default ReactComponent;
}
