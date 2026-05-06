import Link from "next/link";
import type { Task } from "@/lib/os/types";

export type CalendarView = "day" | "week" | "month";

export type CalendarTask = Task & {
  projectName?: string;
};

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function dateKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

function parseDate(value?: string) {
  if (!value) return new Date();
  const parsed = new Date(`${value}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return new Date();
  return parsed;
}

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function getMonthDays(baseDate: Date) {
  const year = baseDate.getFullYear();
  const month = baseDate.getMonth();
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  const days: Array<Date | null> = [];

  for (let i = 0; i < first.getDay(); i += 1) {
    days.push(null);
  }

  for (let day = 1; day <= last.getDate(); day += 1) {
    days.push(new Date(year, month, day));
  }

  while (days.length % 7 !== 0) {
    days.push(null);
  }

  return days;
}

function getWeekDays(baseDate: Date) {
  const start = addDays(baseDate, -baseDate.getDay());
  return Array.from({ length: 7 }, (_, index) => addDays(start, index));
}

function formatMonth(date: Date) {
  return date.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}

function formatShortDate(value: string) {
  return new Date(`${value}T00:00:00`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function taskHref(task: CalendarTask) {
  return `/os/tasks/${task.id}`;
}

function viewHref(view: CalendarView, date: string) {
  return `/os/calendar?view=${view}&date=${date}`;
}

function TaskList({
  tasks,
  compact,
}: {
  tasks: CalendarTask[];
  compact?: boolean;
}) {
  if (tasks.length === 0) {
    return (
      <p className="border-b border-black/30 py-3 text-sm">
        No open tasks in this view yet.
      </p>
    );
  }

  return (
    <>
      {tasks.slice(0, compact ? 5 : 30).map((task) => (
        <Link
          key={task.id}
          href={taskHref(task)}
          className="border-b border-black/30 py-3 flex items-start justify-between gap-4 hover:underline"
        >
          <div className="min-w-0 flex-1">
            <p className="font-bold text-sm truncate">{task.title}</p>
            {task.projectName ? (
              <p className="text-[11px] uppercase tracking-wider truncate">
                {task.projectName}
              </p>
            ) : null}
          </div>
          <span className="font-mono tabular-nums text-xs whitespace-nowrap text-right">
            {task.assignee}
            <br />
            {formatShortDate(task.due_date ?? dateKey(new Date()))}
          </span>
        </Link>
      ))}
    </>
  );
}

export function CalendarPreview({
  tasks,
  compact = false,
  selectedDate,
  view = "month",
}: {
  tasks: CalendarTask[];
  compact?: boolean;
  selectedDate?: string;
  view?: CalendarView;
}) {
  const baseDate = parseDate(selectedDate);
  const selected = dateKey(baseDate);
  const today = dateKey(new Date());
  const datedTasks = tasks
    .filter((task) => task.status !== "done" && task.due_date)
    .sort((a, b) => String(a.due_date).localeCompare(String(b.due_date)));
  const tasksByDate = new Map<string, CalendarTask[]>();

  for (const task of datedTasks) {
    if (!task.due_date) continue;
    const existing = tasksByDate.get(task.due_date) ?? [];
    tasksByDate.set(task.due_date, [...existing, task]);
  }

  const weekDays = getWeekDays(baseDate);
  const selectedTasks = datedTasks.filter((task) => task.due_date === selected);
  const weekKeys = new Set(weekDays.map(dateKey));
  const weekTasks = datedTasks.filter(
    (task) => task.due_date && weekKeys.has(task.due_date),
  );
  const listTasks =
    view === "day" ? selectedTasks : view === "week" ? weekTasks : datedTasks;
  const monthDays = getMonthDays(baseDate);

  return (
    <div>
      <div className="border-b-2 border-black pb-2 mb-2 flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
        <h3 className="font-bold uppercase tracking-wider text-xs">
          {view === "day"
            ? formatShortDate(selected)
            : view === "week"
              ? `Week of ${formatShortDate(dateKey(weekDays[0]))}`
              : formatMonth(baseDate)}
        </h3>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 font-bold uppercase tracking-wider text-xs">
          {(["day", "week", "month"] as const).map((mode) => (
            <Link
              key={mode}
              href={viewHref(mode, selected)}
              className={mode === view ? "underline" : "hover:underline"}
            >
              {mode}
            </Link>
          ))}
          <span className="font-mono tabular-nums">
            {datedTasks.length} dated
          </span>
        </div>
      </div>

      <div className="grid grid-cols-7 border-t-2 border-l-2 border-black">
        {WEEKDAYS.map((day) => (
          <div
            key={day}
            className="border-r-2 border-b-2 border-black px-1.5 py-1 font-bold uppercase tracking-wider text-[10px]"
          >
            {day}
          </div>
        ))}
        {monthDays.map((day, index) => {
          const key = day ? dateKey(day) : `blank-${index}`;
          const dayKey = day ? dateKey(day) : "";
          const tasksForDay = day ? (tasksByDate.get(dayKey) ?? []) : [];
          const isToday = dayKey === today;
          const isSelected = dayKey === selected;

          if (!day) {
            return (
              <div
                key={key}
                className="min-h-16 border-r-2 border-b-2 border-black bg-black/[0.03]"
              />
            );
          }

          return (
            <Link
              key={key}
              href={viewHref("day", dayKey)}
              className={`min-h-16 border-r-2 border-b-2 border-black p-1.5 hover:bg-black hover:text-white ${
                isToday ? "bg-black text-white" : ""
              } ${isSelected && !isToday ? "outline outline-2 outline-black outline-offset-[-4px]" : ""}`}
            >
              <div className="flex items-baseline justify-between gap-1">
                <span className="font-mono tabular-nums text-xs">
                  {day.getDate()}
                </span>
                {tasksForDay.length > 0 ? (
                  <span className="font-mono tabular-nums text-[10px]">
                    {tasksForDay.length}
                  </span>
                ) : null}
              </div>
              {tasksForDay.slice(0, compact ? 1 : 2).map((task) => (
                <p
                  key={task.id}
                  className="mt-1 truncate text-[10px] leading-tight"
                >
                  {task.assignee}: {task.title}
                </p>
              ))}
            </Link>
          );
        })}
      </div>

      <div className="mt-4 border-t-2 border-black">
        <TaskList tasks={listTasks} compact={compact} />
      </div>
    </div>
  );
}
