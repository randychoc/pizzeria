import coreWebVitals from 'eslint-config-next/core-web-vitals'
import typescript from 'eslint-config-next/typescript'

const config = [
  {
    ignores: ['.next/**', 'out/**', 'node_modules/**', 'next-env.d.ts'],
  },
  ...coreWebVitals,
  ...typescript,
  {
    // components/ui/ y hooks/ son scaffolding generado por el CLI de shadcn:
    // se regeneran con la herramienta en vez de editarse a mano, asi que sus
    // avisos son ruido permanente que tapa los del codigo propio. Si algun dia
    // se edita uno de estos archivos a mano, sacarlo de esta excepcion.
    files: ['components/ui/**', 'hooks/**'],
    rules: {
      'react-hooks/set-state-in-effect': 'off',
      'react-hooks/purity': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
    },
  },
]

export default config
