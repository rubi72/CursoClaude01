import { test, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { ToolCallBadge } from "../ToolCallBadge";

afterEach(() => {
  cleanup();
});

test("str_replace_editor create → Creating Button.tsx", () => {
  render(
    <ToolCallBadge
      toolName="str_replace_editor"
      args={{ command: "create", path: "src/Button.tsx" }}
      state="result"
      result="ok"
    />
  );
  expect(screen.getByText("Creating Button.tsx")).toBeDefined();
});

test("str_replace_editor str_replace → Editing App.tsx", () => {
  render(
    <ToolCallBadge
      toolName="str_replace_editor"
      args={{ command: "str_replace", path: "src/App.tsx" }}
      state="result"
      result="ok"
    />
  );
  expect(screen.getByText("Editing App.tsx")).toBeDefined();
});

test("str_replace_editor insert → Editing helpers.ts", () => {
  render(
    <ToolCallBadge
      toolName="str_replace_editor"
      args={{ command: "insert", path: "src/helpers.ts" }}
      state="result"
      result="ok"
    />
  );
  expect(screen.getByText("Editing helpers.ts")).toBeDefined();
});

test("str_replace_editor view → Reading index.tsx", () => {
  render(
    <ToolCallBadge
      toolName="str_replace_editor"
      args={{ command: "view", path: "src/index.tsx" }}
      state="result"
      result="ok"
    />
  );
  expect(screen.getByText("Reading index.tsx")).toBeDefined();
});

test("str_replace_editor undo_edit → Undoing edit in App.tsx", () => {
  render(
    <ToolCallBadge
      toolName="str_replace_editor"
      args={{ command: "undo_edit", path: "src/App.tsx" }}
      state="result"
      result="ok"
    />
  );
  expect(screen.getByText("Undoing edit in App.tsx")).toBeDefined();
});

test("file_manager rename → Renaming OldName.tsx", () => {
  render(
    <ToolCallBadge
      toolName="file_manager"
      args={{ command: "rename", path: "src/OldName.tsx" }}
      state="result"
      result="ok"
    />
  );
  expect(screen.getByText("Renaming OldName.tsx")).toBeDefined();
});

test("file_manager delete → Deleting Unused.tsx", () => {
  render(
    <ToolCallBadge
      toolName="file_manager"
      args={{ command: "delete", path: "src/Unused.tsx" }}
      state="result"
      result="ok"
    />
  );
  expect(screen.getByText("Deleting Unused.tsx")).toBeDefined();
});

test("unknown tool → raw tool name", () => {
  render(
    <ToolCallBadge
      toolName="unknown_tool"
      args={{}}
      state="result"
      result="ok"
    />
  );
  expect(screen.getByText("unknown_tool")).toBeDefined();
});

test("deeply nested path → only basename shown", () => {
  render(
    <ToolCallBadge
      toolName="str_replace_editor"
      args={{ command: "create", path: "a/b/c/deep/Component.tsx" }}
      state="result"
      result="ok"
    />
  );
  expect(screen.getByText("Creating Component.tsx")).toBeDefined();
});

test("state call → spinner shown, no green dot", () => {
  const { container } = render(
    <ToolCallBadge
      toolName="str_replace_editor"
      args={{ command: "create", path: "Button.tsx" }}
      state="call"
    />
  );
  expect(container.querySelector(".animate-spin")).toBeDefined();
  expect(container.querySelector(".bg-emerald-500")).toBeNull();
});

test("state partial-call → spinner shown", () => {
  const { container } = render(
    <ToolCallBadge
      toolName="str_replace_editor"
      args={{ command: "create", path: "Button.tsx" }}
      state="partial-call"
    />
  );
  expect(container.querySelector(".animate-spin")).toBeDefined();
  expect(container.querySelector(".bg-emerald-500")).toBeNull();
});

test("state result with result → green dot shown, no spinner", () => {
  const { container } = render(
    <ToolCallBadge
      toolName="str_replace_editor"
      args={{ command: "create", path: "Button.tsx" }}
      state="result"
      result="ok"
    />
  );
  expect(container.querySelector(".bg-emerald-500")).toBeDefined();
  expect(container.querySelector(".animate-spin")).toBeNull();
});

test("state result with no result → spinner shown (not done yet)", () => {
  const { container } = render(
    <ToolCallBadge
      toolName="str_replace_editor"
      args={{ command: "create", path: "Button.tsx" }}
      state="result"
      result={undefined}
    />
  );
  expect(container.querySelector(".animate-spin")).toBeDefined();
  expect(container.querySelector(".bg-emerald-500")).toBeNull();
});
