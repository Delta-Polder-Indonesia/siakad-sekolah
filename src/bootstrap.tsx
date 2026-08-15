import ReactDOM from 'react-dom/client';
import { AuthProvider } from './context/AuthContext';
import App from './App';

let mounted = false;

/** Mount React hanya setelah critical hero mendapat kesempatan untuk dipaint. */
export function mountApp() {
  if (mounted) return;
  mounted = true;

  ReactDOM.createRoot(document.getElementById('root')!).render(
    <AuthProvider>
      <App />
    </AuthProvider>
  );
}
