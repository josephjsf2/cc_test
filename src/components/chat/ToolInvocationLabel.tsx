import { Loader2 } from "lucide-react";

interface ToolInvocation {
  toolName: string;
  state: string;
  args: Record<string, unknown>;
  result?: unknown;
  toolCallId: string;
}

function getLabel(toolInvocation: ToolInvocation): string {
  const { toolName, args } = toolInvocation;
  const command = args.command as string | undefined;
  const path = args.path as string | undefined;
  const filename = path ? path.split("/").pop() : undefined;

  if (toolName === "str_replace_editor" && command) {
    switch (command) {
      case "create":
        return filename ? `Creating ${filename}` : "Creating file";
      case "str_replace":
      case "insert":
        return filename ? `Editing ${filename}` : "Editing file";
      case "view":
        return filename ? `Viewing ${filename}` : "Viewing file";
      case "undo_edit":
        return filename ? `Undoing edit to ${filename}` : "Undoing edit";
    }
  }

  if (toolName === "file_manager" && command) {
    switch (command) {
      case "rename":
        return filename ? `Renaming ${filename}` : "Renaming file";
      case "delete":
        return filename ? `Deleting ${filename}` : "Deleting file";
    }
  }

  return toolName;
}

interface ToolInvocationLabelProps {
  toolInvocation: ToolInvocation;
}

export function ToolInvocationLabel({ toolInvocation }: ToolInvocationLabelProps) {
  const label = getLabel(toolInvocation);
  const isDone = toolInvocation.state === "result";

  return (
    <div className="inline-flex items-center gap-2 mt-2 px-3 py-1.5 bg-neutral-50 rounded-lg text-xs font-sans border border-neutral-200">
      {isDone ? (
        <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
      ) : (
        <Loader2 className="w-3 h-3 animate-spin text-blue-600" />
      )}
      <span className="text-neutral-700">{label}</span>
    </div>
  );
}
