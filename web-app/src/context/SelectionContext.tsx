import { createContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { RequestHelper } from '@/api/helpers/request';
import { ItemSchema, type ItemDTO } from '@/dto';

interface SelectionContextType {
  selectedItem: ItemDTO | null;
  selectItem: (id: string) => void;
  isLoading: boolean;
  error: string | null;
}

const SelectionContext = createContext<SelectionContextType>({
	error: null,
	isLoading: false,
	selectedItem: null,
	selectItem: () => {}
});

interface SelectionProviderProps {
  children: ReactNode;
}

export const SelectionProvider = ({ children } : SelectionProviderProps) => {
	const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
	const [selectedItem, setSelectedItem] = useState<ItemDTO | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	
	const selectItem = (id: string) => {
		if (id !== selectedItemId) {
			setSelectedItemId(id);
		}
	};

  	useEffect(() => {
		const fetchData = async () => {
			if (!selectedItemId) return;
		
			try {
				setIsLoading(true);
				const response = await RequestHelper.get(`/item/${selectedItemId}`);
				if (response.ok && response.data) {
					const item = ItemSchema.parse(response.data);
					setSelectedItem(item);
				} else {
					setSelectedItem(null);
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
	}, [selectedItemId]);

	useEffect(() => {
		if (selectedItem) {
		setError(null);
		}
	}, [selectedItem])
  
	return (
		<SelectionContext.Provider value={{ selectedItem, isLoading, error, selectItem }}>
			{children}
		</SelectionContext.Provider>
	);
};

export default SelectionContext;
