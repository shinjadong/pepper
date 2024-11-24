import React, { createContext, useContext, useReducer, useCallback, useMemo } from 'react';
import {
  GlobalContext,
  ContextProviderProps,
  ContextUpdateHandler,
  ContextSelector,
} from '@/types/context';

const defaultContext: GlobalContext = {
  editor: {
    content: '',
    cursorPosition: 0,
    fileType: 'markdown',
    dirty: false,
  },
  workspace: {
    openFiles: [],
    recentFiles: [],
  },
  user: {
    preferences: {
      theme: 'system',
      language: 'en',
      aiMode: 'conservative',
      autoComplete: true,
      suggestions: true,
    },
    history: {
      recentCommands: [],
      recentSearches: [],
      recentSuggestions: [],
    },
  },
  assistant: {
    content: '',
    cursorPosition: 0,
    fileType: 'markdown',
    suggestions: [],
  },
};

type ContextAction =
  | { type: 'UPDATE_EDITOR'; payload: Partial<GlobalContext['editor']> }
  | { type: 'UPDATE_WORKSPACE'; payload: Partial<GlobalContext['workspace']> }
  | { type: 'UPDATE_USER'; payload: Partial<GlobalContext['user']> }
  | { type: 'UPDATE_ASSISTANT'; payload: Partial<GlobalContext['assistant']> }
  | { type: 'RESET' };

const contextReducer = (state: GlobalContext, action: ContextAction): GlobalContext => {
  switch (action.type) {
    case 'UPDATE_EDITOR':
      return { ...state, editor: { ...state.editor, ...action.payload } };
    case 'UPDATE_WORKSPACE':
      return { ...state, workspace: { ...state.workspace, ...action.payload } };
    case 'UPDATE_USER':
      return { ...state, user: { ...state.user, ...action.payload } };
    case 'UPDATE_ASSISTANT':
      return { ...state, assistant: { ...state.assistant, ...action.payload } };
    case 'RESET':
      return defaultContext;
    default:
      return state;
  }
};

const GlobalContextInstance = createContext<{
  state: GlobalContext;
  dispatch: React.Dispatch<ContextAction>;
  update: ContextUpdateHandler;
  select: <T>(selector: ContextSelector<T>) => T;
} | null>(null);

export const GlobalContextProvider: React.FC<ContextProviderProps> = ({
  children,
  initialContext = {},
}) => {
  const [state, dispatch] = useReducer(contextReducer, {
    ...defaultContext,
    ...initialContext,
  });

  const update: ContextUpdateHandler = useCallback((context) => {
    if (context.editor) {
      dispatch({ type: 'UPDATE_EDITOR', payload: context.editor });
    }
    if (context.workspace) {
      dispatch({ type: 'UPDATE_WORKSPACE', payload: context.workspace });
    }
    if (context.user) {
      dispatch({ type: 'UPDATE_USER', payload: context.user });
    }
    if (context.assistant) {
      dispatch({ type: 'UPDATE_ASSISTANT', payload: context.assistant });
    }
  }, []);

  const select = useCallback(
    <T,>(selector: ContextSelector<T>): T => {
      return selector(state);
    },
    [state]
  );

  const value = useMemo(
    () => ({
      state,
      dispatch,
      update,
      select,
    }),
    [state, update, select]
  );

  return <GlobalContextInstance.Provider value={value}>{children}</GlobalContextInstance.Provider>;
};

export const useGlobalContext = () => {
  const context = useContext(GlobalContextInstance);
  if (!context) {
    throw new Error('useGlobalContext must be used within a GlobalContextProvider');
  }
  return context;
};

export const useContextSelector = <T,>(selector: ContextSelector<T>): T => {
  const { select } = useGlobalContext();
  return select(selector);
};
