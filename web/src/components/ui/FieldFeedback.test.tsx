import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import FieldFeedback from './FieldFeedback';

describe('FieldFeedback', () => {
  it('renders children and classes', () => {
    render(<FieldFeedback className="my-class">Error</FieldFeedback>);
    const el = screen.getByText('Error');
    expect(el).toBeInTheDocument();
    expect(el).toHaveClass('invalid-feedback');
    expect(el).toHaveClass('my-class');
  });
});
