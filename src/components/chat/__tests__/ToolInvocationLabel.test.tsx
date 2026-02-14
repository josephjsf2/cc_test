import { test, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { ToolInvocationLabel } from "../ToolInvocationLabel";

afterEach(() => {
  cleanup();
});

function makeTool(overrides: Record<string, unknown> = {}) {
  return {
    toolCallId: "test-id",
    toolName: "str_replace_editor",
    state: "result",
    args: {},
    result: "Success",
    ...overrides,
  };
}

test("shows 'Creating filename' for str_replace_editor create command", () => {
  render(
    <ToolInvocationLabel
      toolInvocation={makeTool({ args: { command: "create", path: "/components/App.jsx" } })}
    />
  );
  expect(screen.getByText("Creating App.jsx")).toBeDefined();
});

test("shows 'Editing filename' for str_replace_editor str_replace command", () => {
  render(
    <ToolInvocationLabel
      toolInvocation={makeTool({ args: { command: "str_replace", path: "/components/Card.jsx" } })}
    />
  );
  expect(screen.getByText("Editing Card.jsx")).toBeDefined();
});

test("shows 'Editing filename' for str_replace_editor insert command", () => {
  render(
    <ToolInvocationLabel
      toolInvocation={makeTool({ args: { command: "insert", path: "/utils/helpers.ts" } })}
    />
  );
  expect(screen.getByText("Editing helpers.ts")).toBeDefined();
});

test("shows 'Viewing filename' for str_replace_editor view command", () => {
  render(
    <ToolInvocationLabel
      toolInvocation={makeTool({ args: { command: "view", path: "/index.tsx" } })}
    />
  );
  expect(screen.getByText("Viewing index.tsx")).toBeDefined();
});

test("shows 'Renaming filename' for file_manager rename command", () => {
  render(
    <ToolInvocationLabel
      toolInvocation={makeTool({
        toolName: "file_manager",
        args: { command: "rename", path: "/old-name.tsx" },
      })}
    />
  );
  expect(screen.getByText("Renaming old-name.tsx")).toBeDefined();
});

test("shows 'Deleting filename' for file_manager delete command", () => {
  render(
    <ToolInvocationLabel
      toolInvocation={makeTool({
        toolName: "file_manager",
        args: { command: "delete", path: "/components/Unused.tsx" },
      })}
    />
  );
  expect(screen.getByText("Deleting Unused.tsx")).toBeDefined();
});

test("shows spinner when tool state is not result", () => {
  const { container } = render(
    <ToolInvocationLabel
      toolInvocation={makeTool({ state: "call", result: undefined, args: { command: "create", path: "/App.jsx" } })}
    />
  );
  expect(container.querySelector(".animate-spin")).toBeDefined();
  expect(container.querySelector(".bg-emerald-500")).toBeNull();
});

test("shows green dot when tool state is result", () => {
  const { container } = render(
    <ToolInvocationLabel
      toolInvocation={makeTool({ state: "result", args: { command: "create", path: "/App.jsx" } })}
    />
  );
  expect(container.querySelector(".bg-emerald-500")).toBeDefined();
  expect(container.querySelector(".animate-spin")).toBeNull();
});

test("falls back to raw tool name for unknown tools", () => {
  render(
    <ToolInvocationLabel
      toolInvocation={makeTool({ toolName: "unknown_tool", args: {} })}
    />
  );
  expect(screen.getByText("unknown_tool")).toBeDefined();
});

test("extracts filename correctly from full path", () => {
  render(
    <ToolInvocationLabel
      toolInvocation={makeTool({ args: { command: "create", path: "/deep/nested/path/Component.tsx" } })}
    />
  );
  expect(screen.getByText("Creating Component.tsx")).toBeDefined();
});
