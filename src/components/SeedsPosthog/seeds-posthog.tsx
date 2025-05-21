import { Router } from 'next/router';
import posthog, { type CaptureResult } from 'posthog-js';
import { useEffect } from 'react';

const SeedsPosthog = (): null => {
  useEffect(() => {
      posthog.init(
        process.env.NEXT_PUBLIC_POSTHOG_KEY ??
          'phc_48SkueYRiA0q2z2a2WQfkpbfVOlUqvWzERADAzRl5Dx',
        {
          api_host:
            process.env.NEXT_PUBLIC_POSTHOG_HOST ?? 'https://us.i.posthog.com',
          loaded: posthog => {
            if (process.env.NODE_ENV === 'development') {
              posthog.debug();
            }
          }
        }
      );

    const handleRouteChange: () => CaptureResult | undefined = () => {
      return posthog?.capture('$pageview', { device: 'web' });
    };

    const handleRouteChangeStart: () => CaptureResult | undefined = () =>
      posthog?.capture('$pageleave', {
        device: 'web',
      });

    Router.events.on('routeChangeComplete', handleRouteChange);
    Router.events.on('routeChangeStart', handleRouteChangeStart);

    return () => {
      Router.events.off('routeChangeComplete', handleRouteChange);
      Router.events.off('routeChangeStart', handleRouteChangeStart);
    };
  }, []);

  return null;
};

export default SeedsPosthog;
