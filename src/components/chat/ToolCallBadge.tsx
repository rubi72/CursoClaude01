"use client";

import { Loader2 } from "lucide-react";

interface ToolCallBadgeProps {
  toolName: string;
  args: Record<string, unknown>;
  state: "partial-call" | "call" | "result";
  result?: unknown;
}

function getBasename(path: unknown): string {
  if (typeof path !== "string" || path === "") return "";
  return path.split("/").at(-1) ?? path;
}

function getToolLabel(toolName: string, args: Record<string, unknown>): string {
  const basename = getBasename(args.path);

  if (toolName === "str_replace_editor") {
    switch (args.command) {
      case "create":     return `Creating ${basename}`;
      case "str_replace":
      case "insert":     return `Editing ${basename}`;
      case "view":       return `Reading ${basename}`;
      case "undo_edit":  return `Undoing edit in ${basename}`;
    }
  }

  if (toolName === "file_manager") {
    switch (args.command) {
      case "rename": return `Renaming ${basename}`;
      case "delete": return `Deleting ${basename}`;
    }
  }

  return toolName;
}

export function ToolCallBadge({ toolName, args, state, result }: ToolCallBadgeProps) {
  const label = getToolLabel(toolName, args);
  const isDone = state === "result" && result != null;

  return (
    <div className="inline-flex items-center gap-2 mt-2 px-3 py-1.5 bg-neutral-50 rounded-lg text-xs font-mono border border-neutral-200">
      {isDone ? (
        <>
          <div className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="text-neutral-700">{label}</span>
        </>
      ) : (
        <>
          <Loader2 className="w-3 h-3 animate-spin text-blue-600" />
          <span className="text-neutral-700">{label}</span>
        </>
      )}
    </div>
  );
}
