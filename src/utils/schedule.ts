/** One timed row of the agenda. */
export interface ScheduleSession {
  readonly time: string;
  readonly title: string;
}

/** One day block of the schedule section. */
export interface ScheduleDay {
  readonly label: string;
  readonly theme: string;
  readonly date: string;
  readonly sessions: readonly ScheduleSession[];
}

/** Agenda shown in the "Schedule" section: hackathon finale day plus the
 * conference day (see the hero's 20 November 2026 date). */
export const scheduleDays: readonly ScheduleDay[] = [
  {
    label: 'Day 1',
    theme: 'Hackathon',
    date: 'Nov 19, 2026',
    sessions: [
      { time: '09:00', title: 'Opening Ceremony & Team Check-in' },
      { time: '11:00', title: 'Hackathon Build Sprints' },
      { time: '14:00', title: 'Mentor Clinic: Ship What You Start' },
      { time: '16:00', title: 'Project Demos & Judging' },
    ],
  },
  {
    label: 'Day 2',
    theme: 'Conference',
    date: 'Nov 20, 2026',
    sessions: [
      { time: '09:00', title: 'Door opens, Arrival' },
      { time: '11:00', title: 'Opening address by Head of Depts.(Uniuyo)' },
      {
        time: '14:00',
        title:
          'Welcome address by the TechIgnite Team on “The Journey so far” & SUG address',
      },
      { time: '16:00', title: 'Closing Remark and Afterparty' },
    ],
  },
];
