<script lang="ts">
  import Calendar from "@event-calendar/core";
  import TimeGrid from "@event-calendar/time-grid";
  import DayGrid from "@event-calendar/day-grid";
  import ResourceTimeGrid from "@event-calendar/resource-time-grid";
  import Interaction from "@event-calendar/interaction";
  import CList from "@event-calendar/list";

  import { onMount } from 'svelte'
  import { supabase } from './supabaseClient'
  import type { AuthSession } from '@supabase/supabase-js'
  import Account from './lib/Account.svelte'
  import Auth from './lib/Auth.svelte'

  let session: AuthSession

  onMount(() => {
    supabase.auth.getSession().then(({ data }) => {
      session = data.session
    })

    supabase.auth.onAuthStateChange((_event, _session) => {
      session = _session
    })
  })

  // let currentUserId = 1;

  let oldColors = {}; // id -> bgcolor for mouse hover (very hacky for now)

  let myEvents = [];

  /* default properties of an Event object created from a selection. */
  const defaultEvent = {
    // id will be generated
    // resourceId should be current user id
    // resourceIds unused if resourceId is
    allDay: false,
    // start, end are given in selection
    title: "default event",
    editable: true, // draggable and resizable
    // startEditable // draggable (redundant)
    // display: // TODO?
    backgroundColor: "#555555",
    textColor: "#ffffff",
    extendedProps: {}, // TODO !! important for more capabilities, e.g. deleting?
  }

  let ec;
  let plugins = [TimeGrid, DayGrid, ResourceTimeGrid, Interaction, CList];
  let options = {
    view: "resourceTimeGridDay",
    headerToolbar: {
      start: "prev,next today",
      center: "title",
      end: "dayGridMonth,timeGridWeek,timeGridDay,listWeek resourceTimeGridWeek",
    },
    buttonText: function (texts) {
      texts.resourceTimeGridWeek = "resources";
      return texts;
    },
    resources: [
      { id: 1, title: "Resource A" },
      { id: 2, title: "Resource B" },
    ],
    scrollTime: "09:00:00",
    events: createEvents(),
    pointer: true,
    // views: {
    //     timeGridWeek: {pointer: true},
    //     resourceTimeGridDay: {pointer: true}
    // },
    dayMaxEvents: true,
    nowIndicator: true,
    eventDragMinDistance: 5, // not working?
    selectable: true,
    eventClick: x => {
      console.log("eventClick", x);
      let newTitle = prompt('Event title:', x.event.title);
      // if (newTitle) {
        x.event.title = newTitle;
      // }
      ec.updateEvent(x.event);
    },
    eventMouseEnter: x => {
      // console.log("eventMouseEnter", x);
      let currentbg = x.event.backgroundColor;
      if (!oldColors[x.event.id]) {
        oldColors[x.event.id] = currentbg;
      }
      x.event.backgroundColor = "#dddddd";
      ec.updateEvent(x.event);

    },
    eventMouseLeave: x => {
      // console.log("eventMouseLeave", x);
      x.event.backgroundColor = oldColors[x.event.id];
      delete oldColors[x.event.id];
      ec.updateEvent(x.event);
    },

    // eventDragStop: console.log,
    select: (x) => {
      console.log("selection", x);
      let newEvent = { ...defaultEvent, ...x };
      newEvent.resourceId = x.resource.id;
      ec.addEvent(newEvent);
      ec.unselect();

      // TODO: add to db and call ec.refetchEvents()

      // myEvents.push(x);
      // ec.setOption("events", myEvents);
      // console.log(ec.getEvents());
    },
    editable: true,
  };

  function _pad(num) {
    let norm = Math.floor(Math.abs(num));
    return (norm < 10 ? "0" : "") + norm;
  }

  // initial dummy events
  function createEvents() {
    let days = [];
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
    myEvents = [
      {
        start: days[6] + " 09:00",
        end: days[6] + " 10:30",
        resourceId: 1,
        title: "breakfast!",
        color: "#FE1B34",
      },

      {
        start: days[0] + " 00:00",
        end: days[0] + " 09:00",
        resourceId: 1,
        display: "background",
      },
      {
        start: days[1] + " 12:00",
        end: days[1] + " 14:00",
        resourceId: 2,
        display: "background",
      },
      {
        start: days[2] + " 17:00",
        end: days[2] + " 24:00",
        resourceId: 1,
        display: "background",
      },
      {
        start: days[3] + " 10:00",
        end: days[3] + " 14:00",
        resourceId: 1,
        title: "The calendar can display background and regular events",
        color: "#FE6B64",
      },
      {
        start: days[1] + " 16:00",
        end: days[2] + " 08:00",
        resourceId: 2,
        title: "An event may span to another day",
        color: "#B29DD9",
      },
      {
        start: days[2] + " 09:00",
        end: days[2] + " 13:00",
        resourceId: 2,
        title:
          "Events can be assigned to resources and the calendar has the resources view built-in",
        color: "#779ECB",
      },
      {
        start: days[3] + " 14:00",
        end: days[3] + " 20:00",
        resourceId: 1,
        title: "",
        color: "#FE6B64",
      },
      {
        start: days[3] + " 15:00",
        end: days[3] + " 18:00",
        resourceId: 1,
        title: "Overlapping events are positioned properly",
        color: "#779ECB",
      },
      {
        start: days[5] + " 10:00",
        end: days[5] + " 16:00",
        resourceId: 2,
        title: {
          html: "You have complete control over the <i><b>display</b></i> of events…",
        },
        color: "#779ECB",
      },
      {
        start: days[6] + " 14:00",
        end: days[6] + " 19:00",
        resourceId: 2,
        title: "…and you can drag and drop the events!",
        color: "#FE6B64",
      },
      {
        start: days[7] + " 18:00",
        end: days[7] + " 21:00",
        resourceId: 2,
        title: "",
        color: "#B29DD9",
      },
      {
        start: days[1],
        end: days[3],
        resourceId: 1,
        title: "All-day events can be displayed at the top",
        color: "#B29DD9",
        allDay: true,
      },
    ];

    return myEvents;
  }

  import Demo from "./demo.svelte";
</script>

<Calendar bind:this={ec} {plugins} {options} />
<Calendar {plugins} {options} />


<div class="container" style="padding: 50px 0 100px 0">
    {#if !session}
    <Auth />
    {:else}
    <Account {session} />
    {/if}
  </div>

<!-- <Demo /> -->
