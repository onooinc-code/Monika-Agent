import { Inbox } from '@novu/react';

function NotificationInbox() {
  const applicationIdentifier = import.meta.env.VITE_NOVU_APPLICATION_IDENTIFIER;
  
  if (!applicationIdentifier) {
    console.error('VITE_NOVU_APPLICATION_IDENTIFIER is not defined');
    return null;
  }

  return (
    <Inbox
      applicationIdentifier={applicationIdentifier}
      subscriberId={"68cf75ebbbdc3dfc0e9e433d"}
      appearance={{
        baseTheme: 'dark',
        variables: {
          colorPrimary: '#818cf8',
          colorBackground: '#0a0a0f',
          colorForeground: '#e5e7eb',
        },
        elements: {
          bellIcon: {
            color: '#818cf8',
          },
        },
      }}
    />
  );
}

export default NotificationInbox;
