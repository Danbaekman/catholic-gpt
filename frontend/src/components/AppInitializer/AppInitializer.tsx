import { useActionState, useEffect } from 'react';
import useLocalStorageState from 'use-local-storage-state';

import { PageLoader } from '@/components/PageLoader';

interface OwnProps {
  children: React.ReactNode;
}

export const AppInitializer = ({ children }: OwnProps) => {
  const [userId, setUserId] = useLocalStorageState('userId', {
    defaultValue: '',
  });
  const [_, getUserIdFromServer, isPending] = useActionState(async () => {
    setUserId(await getUserId());
  }, null);

  useEffect(() => {
    if (!userId) {
      getUserIdFromServer();
    }
  }, [userId, setUserId, getUserIdFromServer]);

  if (!userId || isPending) {
    return <PageLoader data-testid="app-initializer-loader" />;
  }

  return children;
};

const getUserId = async () => {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/app-user`, {
    method: 'POST',
  });
  const data = await response.json();
  return data.id;
};
