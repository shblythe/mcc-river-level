import { render, screen } from '@testing-library/react';
import App from '../App';

test('renders title', () => {
  render(<App />);
  const titleElement = screen.getByText(/manchester canoe club/i);
  const subTitleElement = screen.getByText(/river level/i);
  expect(titleElement).toBeInTheDocument();
  expect(subTitleElement).toBeInTheDocument();
});
