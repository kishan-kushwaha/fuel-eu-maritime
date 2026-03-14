import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';

describe('Fuel EU Maritime frontend', () => {
  it('renders compliance dashboard heading', () => {
    render(<App />);
    expect(screen.getByText(/Compliance Dashboard/i)).toBeInTheDocument();
  });

  it('renders all four tabs', () => {
    render(<App />);

    expect(screen.getAllByText(/Routes/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Compare/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Banking/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Pooling/i).length).toBeGreaterThan(0);
  });
});