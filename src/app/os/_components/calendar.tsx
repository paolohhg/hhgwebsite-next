import type { Task } from "@/lib/os/types";

type CalendarTask = Task & {
  projectName?: string;
};

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function dateKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

function getMonthDays(baseDate = new Date()) {
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

export function CalendarPreview({
  tasks,
  compact = false,
}: {
  tasks: CalendarTask[];
  compact?: boolean;
}) {
  const today = dateKey(new Date());
  const monthDays = getMonthDays();
  const datedTasks = tasks
    .filter((task) => task.status !== "done" && task.due_date)
    .sort((a, b) => String(a.due_date).localeCompare(String(b.due_date)));
  const tasksByDate = new Map<string, CalendarTask[]>();

  for (const task of datedTasks) {
    if (!task.due_date) continue;
    const existing = tasksByDate.get(task.due_date) ?? [];
    tasksByDate.set(task.due_date, [...existing, task]);
  }

  return (
    <div>
      <div className="border-b-2 border-black pb-2 mb-2 flex items-baseline justify-between">
        <h3 className="font-bold uppercase tracking-wider text-xs">
          {formatMonth(new Date())}
        </h3>
        <span className="font-mono tabular-nums text-xs uppercase tracking-wider">
          {datedTasks.length} dated
        </span>
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
          const tasksForDay = day ? (tasksByDate.get(dateKey(day)) ?? []) : [];
          const isToday = day ? dateKey(day) === today : false;
          return (
            <div
              key={key}
              className={`min-h-16 border-r-2 border-b-2 border-black p-1.5 ${
                isToday ? "bg-black text-white" : ""
              } ${day ? "" : "bg-black/[0.03]"}`}
            >
              {day ? (
                <>
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
                </>
              ) : null}
            </div>
          );
        })}
      </div>

      <div className="mt-4 border-t-2 border-black">
        {datedTasks.length === 0 ? (
          <p className="border-b border-black/30 py-3 text-sm">
            No open tasks have due dates yet.
          </p>
        ) : (
          datedTasks.slice(0, compact ? 5 : 20).map((task) => (
            <div
              key={task.id}
              className="border-b border-black/30 py-3 flex items-start justify-between gap-4"
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
                {formatShortDate(task.due_date ?? today)}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
