import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Sidebar } from "./Sidebar";

describe("Sidebar", () => {
  it("shows admin links when admin role toggled", () => {
    render(
      <MemoryRouter>
        <Sidebar isAdmin isCustomer={false} />
      </MemoryRouter>,
    );
    expect(screen.getByText("Inventory")).toBeInTheDocument();
  });
});


