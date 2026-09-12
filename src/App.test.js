import { render, screen } from '@testing-library/react';
import App from './App';

test('renders portfolio greeting', () => {
  render(<App />);
  const linkElement = screen.getByText(/Surya/i);
  expect(linkElement).toBeTruthy();
});
