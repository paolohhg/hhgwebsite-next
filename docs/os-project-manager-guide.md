# Heard OS Project Manager Guide

Heard OS lives at `/os`. It is the private project management dashboard for Heard Hospitality Group work: projects, tasks, calendar commitments, and sellable assets.

Use this guide as the operating manual for what to put where, when to update it, and how Paolo and Chef Mel should read the dashboard.

## Operating Principle

Heard OS should answer four questions fast:

- What needs attention today?
- Which projects are active, blocked, or drifting?
- Who owns the next move?
- What is ready to sell, reuse, ship, or revive?

If a piece of information does not help answer one of those questions, keep it out of the dashboard or put it in notes.

## Main Screens

### Command Center

Use `/os` as the morning home base.

The Command Center shows:

- Active Projects: current work that still needs movement.
- Open Tasks: work not marked done.
- Needs Attention: overdue tasks, tasks due today, and stale active projects.
- Ready to Sell: assets marked ready-to-sell.
- Today: overdue, due-today, and doing tasks.
- Calendar: dated task preview.
- Next Actions: active projects with a next action.
- Stale Active Projects: active projects that have not been updated recently.
- Owner Load: Paolo/Mel/shared work counts.
- Sellable Assets: inventory that can be offered or reused.

Click the At a Glance rows to open the full matching section. Use this when a number looks wrong or needs review.

### Projects

Use Projects for outcomes, initiatives, or workstreams that have more than one step.

Create a project when:

- It will take more than one sitting.
- It has multiple tasks or decisions.
- It belongs to a brand, revenue path, customer, system, or operating goal.
- It needs a next action that might otherwise get lost.

Do not create a project for a single quick action. Make that a task.

Project fields:

- Name: short, plain title.
- Brand: the business or system the work belongs to.
- Status: active, pilot, dormant, or shipped.
- Owner: Paolo, Mel, or Both.
- Revenue Tier: producing, near-term, long-term, or blank.
- Next Action: the next specific movement needed.
- Description: what this project is.
- Notes: context, decisions, links, loose thinking.

Use project detail pages to:

- Read the current state before editing.
- Add a quick task tied to the project.
- Scan linked tasks by status.
- Update the next action.
- Move dormant or shipped work out of the active pile.

Project status rules:

- Active: being worked or should move soon.
- Pilot: experimental or being tested before becoming normal work.
- Dormant: parked intentionally.
- Shipped: completed enough that it no longer belongs in active review.

### Tasks

Use Tasks for specific actions someone can do.

Create a task when:

- It has a clear verb.
- One person can own it.
- It can be completed or moved forward.
- It may need a due date.

Good task examples:

- Call vendor about invoice.
- Draft Mel's Table launch checklist.
- Add catering photos to Drive.
- Review ContractForge pricing copy.

Weak task examples:

- Website.
- Sales.
- Think about menu.
- Figure out operations.

Task fields:

- Title: specific action.
- Assignee: Paolo or Mel.
- Status: open, doing, done.
- Due Date: only add one when date matters.
- Project: optional, but recommended when the task belongs to a larger workstream.
- Notes: extra context.

Task status rules:

- Open: needs doing, not actively in progress.
- Doing: currently moving or should be top of mind.
- Done: completed.

Use the Tasks page to:

- Filter Paolo or Mel's work.
- Review Today first.
- Move tasks from open to doing to done.
- Switch assignment between Paolo and Mel.
- Open a task for full edits.

### Calendar

Use Calendar for date-based work, not as a dumping ground.

Add a due date when:

- A task must happen on or before a specific day.
- It affects a meeting, event, sale, launch, delivery, or follow-up.
- It needs to surface in Today.

Avoid due dates when:

- The date is fake.
- The task is just generally important.
- The work should be managed by priority instead.

Calendar views:

- Day: what is due on one day.
- Week: the near-term load.
- Month: broad operating rhythm.

Click a day to add a task quickly. Open the task detail page when it needs full context.

### Assets

Use Assets for sellable, reusable, or packaged inventory.

Create an asset when:

- It can be sold.
- It can be reused in delivery.
- It is a template, system, tool, service, content package, or product.
- It has a Drive link or notes worth preserving.

Asset status rules:

- Ready-to-sell: packaged enough to offer.
- Needs-work: useful, but not ready.
- Dormant: parked or not currently relevant.
- Sold: used/sold/completed as an offer.

Use asset notes for:

- What's included.
- What still needs work.
- Where the asset lives.
- How it might be sold or reused.

## Daily Rhythm

### Morning Review

Start at Command Center.

1. Check Needs Attention.
2. Check Today.
3. Review Doing tasks.
4. Review Next Actions.
5. Assign or reassign anything unclear.
6. Add due dates only where timing really matters.

Goal: know the day without opening every page.

### During Work

Use the fastest path:

- If it is a quick action, add a task.
- If it belongs to a project, add it from the project detail page.
- If it has a date, add it from the calendar.
- If it is sellable/reusable, add it as an asset.

Move work to done immediately when completed. Do not wait for end-of-day cleanup.

### End-of-Day Reset

Spend five minutes:

- Move completed tasks to done.
- Move current work to doing.
- Update project next actions.
- Move stalled work out of active status if it is no longer truly active.
- Check if any ready-to-sell asset should be surfaced tomorrow.

## Weekly Review

Once a week:

- Open Active Projects and confirm each one deserves to stay active.
- Check Stale Active Projects.
- Move parked work to dormant.
- Confirm shipped work is marked shipped.
- Review Paolo/Mel owner load.
- Review Ready to Sell assets.
- Turn loose notes into tasks where needed.

The weekly review is where the dashboard stays honest.

## House Rules

### One Next Action Per Active Project

Every active project should have one clear next action. If there are many possible actions, choose the one that moves the project next.

### Dates Are Commitments

Do not use due dates as general priority markers. If everything has a due date, Today stops being useful.

### Doing Means Visible

Doing should be a short list. It is what should stay in front of Paolo/Mel right now.

### Dormant Is Healthy

Dormant does not mean failed. It means intentionally parked.

### Notes Are Context, Tasks Are Action

If it has to be done, make it a task. If it explains why or how, put it in notes.

## What Is Not Finished Yet

These are planned but not fully wired into production:

- Project priority.
- Project health: on-track, at-risk, blocked, paused.
- Project start date and target date.
- Blocker reason.
- Task priority.
- Task blocker reason.
- Task updated-at signal.
- Asset owner.
- Asset price or revenue value.
- Asset customer.
- Asset last-reviewed date.
- Search across projects/tasks/assets.
- Recurring tasks.
- Milestones.
- Comments or update log.
- Attachments beyond URL fields.

The schema plan is in `docs/os-dashboard-schema-plan.sql`. Apply those database changes before building UI that writes to those new fields.

## What Else Users Need To Know

### Access

Heard OS is private. Only allowlisted emails should be able to log in. Paolo and Chef Mel are the first intended users.

### Password Setup

If password login fails before a password is set, use the setup/magic-link flow once, then set a password at `/os/password`.

### Mobile Use

The dashboard is designed to be usable on phone width. Use mobile for checking, assigning, and quick task capture. Use desktop for larger cleanup and project notes.

### Data Source Of Truth

If work belongs in Heard OS, update Heard OS. Avoid keeping a second conflicting list in chat, notes, or memory.

### When Something Looks Wrong

If a dashboard number looks wrong:

- Click the number.
- Review the full list.
- Fix status, owner, due date, or project relationship.
- Then return to Command Center.

Usually the dashboard is only as accurate as the status fields behind it.

## Review Questions For Paolo And Mel

Use these while testing:

- Are the project statuses right for HHG's real workflow?
- Does Ready-to-sell mean ready to invoice, ready to pitch, or ready to reuse?
- Should assets have prices now, or later?
- Should Both-owned work count in both Paolo and Mel views?
- Which tasks repeat weekly or monthly?
- What makes a project blocked versus dormant?
- What should be visible on the Command Center before scrolling?
- Should Chef Mel have a different default view than Paolo?

Answering these will shape the next build pass.
