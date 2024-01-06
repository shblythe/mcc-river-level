import { render, screen } from '@testing-library/react';
import App from '../App';

jest.mock('@mui/x-charts/LineChart', () => (...rest) => {
    return (<div/>)
});

test('renders title', () => {
  render(<App />);
  const titleElement = screen.getByText(/manchester canoe club/i);
  const subTitleElement = screen.getByText(/river level/i);
  expect(titleElement).toBeInTheDocument();
  expect(subTitleElement).toBeInTheDocument();
});
