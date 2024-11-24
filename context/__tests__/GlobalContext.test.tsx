import React from 'react';
import { render, act } from '@testing-library/react';
import { GlobalContextProvider, useGlobalContext, useContextSelector } from '../GlobalContext';

describe('GlobalContext', () => {
  const TestComponent = () => {
    const { state, update } = useGlobalContext();
    return (
      <div>
        <div data-testid="editor-content">{state.editor.content}</div>
        <button
          onClick={() =>
            update({
              editor: { content: 'Updated content' },
            })
          }
          data-testid="update-button"
        >
          Update
        </button>
      </div>
    );
  };

  const SelectorTestComponent = () => {
    const content = useContextSelector((state) => state.editor.content);
    return <div data-testid="selected-content">{content}</div>;
  };

  it('provides default context values', () => {
    const { getByTestId } = render(
      <GlobalContextProvider>
        <TestComponent />
      </GlobalContextProvider>
    );

    expect(getByTestId('editor-content')).toHaveTextContent('');
  });

  it('updates context values', () => {
    const { getByTestId } = render(
      <GlobalContextProvider>
        <TestComponent />
      </GlobalContextProvider>
    );

    act(() => {
      getByTestId('update-button').click();
    });

    expect(getByTestId('editor-content')).toHaveTextContent('Updated content');
  });

  it('allows context selection', () => {
    const { getByTestId } = render(
      <GlobalContextProvider initialContext={{ editor: { content: 'Initial' } }}>
        <SelectorTestComponent />
      </GlobalContextProvider>
    );

    expect(getByTestId('selected-content')).toHaveTextContent('Initial');
  });

  it('throws error when used outside provider', () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => {
      render(<TestComponent />);
    }).toThrow('useGlobalContext must be used within a GlobalContextProvider');

    consoleError.mockRestore();
  });

  it('accepts initial context', () => {
    const initialContext = {
      editor: {
        content: 'Initial content',
        cursorPosition: 5,
      },
    };

    const { getByTestId } = render(
      <GlobalContextProvider initialContext={initialContext}>
        <TestComponent />
      </GlobalContextProvider>
    );

    expect(getByTestId('editor-content')).toHaveTextContent('Initial content');
  });
});
