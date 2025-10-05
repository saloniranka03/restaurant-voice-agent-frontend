/**
 * Basic test file for App component
 */

import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders restaurant name", () => {
  render(<App />);
  const linkElement = screen.getByText(/LChaat Bhavan/i);
  expect(linkElement).toBeInTheDocument();
});
