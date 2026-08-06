import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['dist', 'node_modules', 'coverage'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: {
        ...globals.browser,
        ...globals.node, // Menambahkan global node agar file konfigurasi seperti vite.config.ts tidak error
      },
    },
    plugins: {
      // DIPERBAIKI: Memastikan objek plugin diekstrak dengan benar agar kompatibel dengan ESLint v9+
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      // Mengaktifkan aturan bawaan react-hooks
      ...reactHooks.configs.recommended.rules,
      
      // Aturan Fast Refresh untuk React-Vite
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      
      // 1. Matikan aturan ketat tipe 'any' agar coding lebih bebas
      '@typescript-eslint/no-explicit-any': 'off',
      
      // 2. Abaikan variabel yang tidak terpakai (Unused Variables)
      '@typescript-eslint/no-unused-vars': 'off', 
      
      // 3. Matikan aturan dependency array yang ketat pada useEffect/useMemo
      'react-hooks/exhaustive-deps': 'off', 
    },
  }
);
