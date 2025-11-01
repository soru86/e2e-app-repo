import { vi } from "vitest";
import { render, screen } from "@testing-library/react";
import App from "../src/App";
import axios from "axios";

vi.mock("axios");

describe("App", () => {
  it("renders headline", () => {
    vi.mocked(axios.get).mockResolvedValue("");
    render(<App />);
    const headline = screen.getByText("Transaction History").closest("a");
    expect(headline).toHaveAttribute("href", "/history");
  });
});
