import React, { useState, useEffect } from 'react';
import {
  AssistantProps,
  AssistantState,
  AssistantMode,
  AssistantPosition,
} from '@/types/assistant';
import { cn } from '@/lib/utils';

const defaultState: AssistantState = {
  isVisible: true,
  position: 'sidebar',
  mode: 'writing',
  isLoading: false,
};

export const Assistant: React.FC<AssistantProps> = ({
  position = 'sidebar',
  mode = 'writing',
  context,
  onSuggestionSelect,
  onModeChange,
  onPositionChange,
  className,
}) => {
  const [state, setState] = useState<AssistantState>({
    ...defaultState,
    position,
    mode,
  });

  useEffect(() => {
    setState((prev) => ({ ...prev, position, mode }));
  }, [position, mode]);

  const handleModeChange = (newMode: AssistantMode) => {
    setState((prev) => ({ ...prev, mode: newMode }));
    onModeChange?.(newMode);
  };

  const handlePositionChange = (newPosition: AssistantPosition) => {
    setState((prev) => ({ ...prev, position: newPosition }));
    onPositionChange?.(newPosition);
  };

  const handleSuggestionClick = (suggestion: any) => {
    onSuggestionSelect?.(suggestion);
  };

  const renderSuggestions = () => {
    if (!context.suggestions?.length) return null;

    return (
      <div className="space-y-2">
        {context.suggestions.map((suggestion, index) => (
          <div
            key={index}
            className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
            onClick={() => handleSuggestionClick(suggestion)}
          >
            <div className="font-medium">{suggestion.text}</div>
            {suggestion.explanation && (
              <div className="text-sm text-gray-500">{suggestion.explanation}</div>
            )}
          </div>
        ))}
      </div>
    );
  };

  const positionClasses = {
    cursor: 'absolute',
    sidebar: 'fixed right-0 top-0 h-full',
    floating: 'fixed bottom-4 right-4',
  };

  return (
    <div
      className={cn(
        'bg-white dark:bg-gray-900 shadow-lg rounded-lg p-4',
        'transition-all duration-200 ease-in-out',
        positionClasses[state.position],
        {
          'opacity-0 pointer-events-none': !state.isVisible,
          'w-64': state.position === 'sidebar',
          'w-96': state.position === 'floating',
        },
        className
      )}
      data-testid="assistant"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex space-x-2">
          {(['writing', 'coding', 'analysis'] as AssistantMode[]).map((m) => (
            <button
              key={m}
              className={cn(
                'px-2 py-1 rounded text-sm',
                state.mode === m ? 'bg-blue-500 text-white' : 'bg-gray-100 dark:bg-gray-800'
              )}
              onClick={() => handleModeChange(m)}
            >
              {m.charAt(0).toUpperCase() + m.slice(1)}
            </button>
          ))}
        </div>
        <div className="flex space-x-2">
          {(['cursor', 'sidebar', 'floating'] as AssistantPosition[]).map((p) => (
            <button
              key={p}
              className={cn(
                'p-1 rounded',
                state.position === p ? 'bg-blue-500 text-white' : 'bg-gray-100 dark:bg-gray-800'
              )}
              onClick={() => handlePositionChange(p)}
            >
              <span className="sr-only">{p}</span>
              {/* Add icons here */}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="space-y-4">
        {state.isLoading ? (
          <div className="animate-pulse space-y-2">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
          </div>
        ) : (
          <>
            {state.error ? (
              <div className="text-red-500 text-sm">{state.error}</div>
            ) : (
              renderSuggestions()
            )}
          </>
        )}
      </div>
    </div>
  );
};
