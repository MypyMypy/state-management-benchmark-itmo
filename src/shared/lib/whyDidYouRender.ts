import React from 'react';
import whyDidYouRenderInit from '@welldone-software/why-did-you-render';

// Initialize why-did-you-render BEFORE first React render to avoid hook order issues.
if (import.meta.env.DEV) {
  const fn = (whyDidYouRenderInit as any).default ?? whyDidYouRenderInit;
  if (typeof fn === 'function') {
    fn(React, { trackAllPureComponents: true });
  }
}
