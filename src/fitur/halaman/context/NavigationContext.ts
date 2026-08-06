import { createContext, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

export interface NavigationContextType {
  goBack: () => void;
  navigateTo: (menu: string) => void;
  isModalNavigation: boolean;
}

export const NavigationContext = createContext<NavigationContextType>({
  goBack: () => {},
  navigateTo: () => {},
  isModalNavigation: false,
});

export const useModalNavigation = () => useContext(NavigationContext);

export function useBackNavigation() {
  const { goBack, isModalNavigation } = useModalNavigation();
  const navigate = useNavigate();

  if (isModalNavigation) return goBack;
  return () => navigate(-1);
}

export function useSectionNavigate() {
  const { navigateTo, isModalNavigation } = useModalNavigation();
  const navigate = useNavigate();

  if (isModalNavigation) return navigateTo;
  return (path: string) => navigate(path);
}
