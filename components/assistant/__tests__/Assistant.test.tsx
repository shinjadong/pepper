import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Assistant } from '../Assistant';
import { AssistantContext, AssistantMode, AssistantPosition } from '@/types/assistant';

describe('Assistant', () => {
  const mockContext: AssistantContext = {
    content: 'Test content',
    cursorPosition: 0,
    fileType: 'markdown',
    suggestions: [
      {
        text: 'Test suggestion',
        type: 'completion',
        confidence: 0.9,
        explanation: 'This is a test suggestion',
      },
    ],
  };

  const defaultProps = {
    context: mockContext,
  };

  it('renders successfully', () => {
    render(<Assistant {...defaultProps} />);
    expect(screen.getByTestId('assistant')).toBeInTheDocument();
  });

  it('displays suggestions when provided', () => {
    render(<Assistant {...defaultProps} />);
    expect(screen.getByText('Test suggestion')).toBeInTheDocument();
    expect(screen.getByText('This is a test suggestion')).toBeInTheDocument();
  });

  it('handles mode changes', () => {
    const onModeChange = jest.fn();
    render(<Assistant {...defaultProps} onModeChange={onModeChange} />);

    fireEvent.click(screen.getByText('Coding'));
    expect(onModeChange).toHaveBeenCalledWith('coding');
  });

  it('handles position changes', () => {
    const onPositionChange = jest.fn();
    render(<Assistant {...defaultProps} onPositionChange={onPositionChange} />);

    const positionButtons = screen.getAllByRole('button');
    // Find the floating position button (third position option)
    fireEvent.click(positionButtons[5]);
    expect(onPositionChange).toHaveBeenCalledWith('floating');
  });

  it('handles suggestion selection', () => {
    const onSuggestionSelect = jest.fn();
    render(<Assistant {...defaultProps} onSuggestionSelect={onSuggestionSelect} />);

    fireEvent.click(screen.getByText('Test suggestion'));
    expect(onSuggestionSelect).toHaveBeenCalledWith(mockContext.suggestions![0]);
  });

  it('applies correct position classes', () => {
    const { rerender } = render(<Assistant {...defaultProps} position="floating" />);
    expect(screen.getByTestId('assistant')).toHaveClass('fixed bottom-4 right-4');

    rerender(<Assistant {...defaultProps} position="sidebar" />);
    expect(screen.getByTestId('assistant')).toHaveClass('fixed right-0 top-0 h-full');
  });

  it('shows loading state', () => {
    const contextWithoutSuggestions: AssistantContext = {
      ...mockContext,
      suggestions: undefined,
    };

    render(<Assistant context={contextWithoutSuggestions} />);
    expect(screen.queryByText('Test suggestion')).not.toBeInTheDocument();
  });
});
