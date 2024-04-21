import type { CalendarEvent } from "types/calendar";

function _pad(num) {
  let norm = Math.floor(Math.abs(num));
  return (norm < 10 ? "0" : "") + norm;
}

let currentUserId = 1;

export default function createEvents() {
    let days: string[] = [];
    for (let i = -1; i < 8; ++i) {
      let day = new Date();
      let diff = i - day.getDay();
      day.setDate(day.getDate() + diff);
      days[i] =
        day.getFullYear() +
        "-" +
        _pad(day.getMonth() + 1) +
        "-" +
        _pad(day.getDate());
    }

    // return
    let myEvents: CalendarEvent[] = [];
    let toAdd = [
      {
        start: days[6] + " 09:00",
        end: days[6] + " 10:30",
        resourceId: 1,
        title: "breakfast!",
        // color: "#FE5B74",
      },
      {
        start: days[6] + " 14:00",
        end: days[6] + " 19:00",
        resourceId: 2,
        title: "nap time",
        // color: "#44C299",
      },
      {
        start: days[3] + " 10:00",
        end: days[3] + " 14:00",
        resourceId: 1,
        title: "The calendar can display background and regular events",
        // color: "#FE6B64",
      },
      {
        start: days[1] + " 16:00",
        end: days[2] + " 08:00",
        resourceId: 2,
        title: "An event may span to another day",
        // color: "#B29DD9",
      },
      {
        start: days[2] + " 09:00",
        end: days[2] + " 13:00",
        resourceId: 2,
        title:
          "Events can be assigned to resources and the calendar has the resources view built-in",
        // color: "#779ECB",
      },
      {
        start: days[3] + " 14:00",
        end: days[3] + " 20:00",
        resourceId: 1,
        title: "",
        // color: "#FE6B64",
      },
      {
        start: days[3] + " 15:00",
        end: days[3] + " 18:00",
        resourceId: 1,
        title: "Overlapping events are positioned properly",
        // color: "#779ECB",
      },
      {
        start: days[5] + " 10:00",
        end: days[5] + " 16:00",
        resourceId: 2,
        title: "You have complete control over the <i><b>display</b></i> of events…",
        // color: "#779ECB",
      },
      {
        start: days[7] + " 18:00",
        end: days[7] + " 21:00",
        resourceId: 2,
        title: "",
        // color: "#B29DD9",
      },
      {
        start: days[1],
        end: days[3],
        resourceId: 1,
        title: "All-day events can be displayed at the top",
        // color: "#B29DD9",
        allDay: true,
      },
    ];

    myEvents = myEvents.concat(toAdd);

    myEvents.map((x) => {
      if (x.resourceId === Number(currentUserId)) {
        x.editable = true;
      } else {
        x.editable = false;
        x.startEditable = false;
        x.durationEditable = false;
      }
    });

    return myEvents;
  }