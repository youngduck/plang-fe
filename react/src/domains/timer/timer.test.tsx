import { describe, it, expect } from "vitest";
import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import Timer from "./timer";

describe("Timer", () => {
  it("should render", () => {
    render(<Timer />);
    expect(screen.getByText("타이머")).toBeInTheDocument();
  });
});