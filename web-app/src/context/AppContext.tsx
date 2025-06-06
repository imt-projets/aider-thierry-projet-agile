import React, { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { RequestHelper } from '@/api/helpers/request';
import { ItemSchema, type ItemDTO } from '@/dto';

interface AppContextType {
  selectedElement: ItemDTO | null;
  selectElementInHierarchy: (id: string) => void;
  isLoading: boolean;
  error: string | null;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [selectedElement, setSelectedElement] = useState<ItemDTO | null>(null);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectElementInHierarchy = async (id: string) => {
    setSelectedElementId(id);
  }

  useEffect(() => {
    const fetchData = async () => {
      if (!selectedElementId) return;
  
      try {
        setIsLoading(true);
        const response = await RequestHelper.get(`/item/${selectedElementId}`);
        if (response.ok && response.data) {
          const item = ItemSchema.parse(response.data);
          setSelectedElement(item);
        } else {
          setSelectedElement(null);
          setError('Une erreur est survenue, contactez l\'administrateur');
        }
      } catch (error) {
        console.error(error);
        setError('Une erreur est survenue, contactez l\'administrateur');
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchData();
  }, [selectedElementId]);

  useEffect(() => {
    if (selectedElement != null) {
      setError(null);
    }
  }, [selectedElement])
  

  return (
    <AppContext.Provider value={{ selectedElement, selectElementInHierarchy, isLoading, error }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext doit être utilisé à l\'intérieur d\'un AppProvider');
  }
  return context;
};
