# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default tseslint.config({
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

- Replace `tseslint.configs.recommended` to `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`
- Optionally add `...tseslint.configs.stylisticTypeChecked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and update the config:

```js
// eslint.config.js
import react from 'eslint-plugin-react'

export default tseslint.config({
  // Set the react version
  settings: { react: { version: '18.3' } },
  plugins: {
    // Add the react plugin
    react,
  },
  rules: {
    // other rules...
    // Enable its recommended rules
    ...react.configs.recommended.rules,
    ...react.configs['jsx-runtime'].rules,
  },
})
```

# About project

This project is a web application for book managing, where you can manage what you want to read, are reading, have just read and based on this can take some recommendations. Google Books API and firebase is used for it.

Perhaps later there will be a page with challenges, which are global or private, you will be added friends, chat with them and share private challenges

This project is done for OOP lessons and now there are implemented such elements:
- class BookList: 1 protected field, 5 methods and 1 getter and 1 setter
- class RecommendationList extends BookList: 3 methods (1 of them implements polymorphism)
- class User: 8 fields, 5 methods, 3 getters and 1 setter
- class ApiClient: 1 protected static field, 3 static methods (2 of them use generics)
- class BookApi extends ApiClient: 2 methods
- class FirebaseApi: 10 static methods
- class Serializer: 2 abstract methods with generics
- class BookSerializer extends Serializer: 2 methods
- components: LoginCard + RegisterCard, BasicInput, BookCard, Home, List, Modal, NavList, Profile