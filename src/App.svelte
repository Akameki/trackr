<script lang="ts">
  import Calendar from "@event-calendar/core";
  import TimeGrid from "@event-calendar/time-grid";
  import DayGrid from "@event-calendar/day-grid";
  import Resourse from "@event-calendar/resource-time-grid";
  import iterx from "@event-calendar/interaction";
  import listy from "@event-calendar/list";

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

  let myEvents = [];

  let ec;
  let plugins = [TimeGrid, DayGrid, Resourse, iterx, listy];
  let options = {
    view: "timeGridDay",
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
    selectable: true,
    eventDragStart: x => {
      // // prompt user to change text of event
      // console.log(x.event);
      // console.log(x.event.title);
      // let updated = prompt('Change event text', x.event.title);
      // if (updated) {
      //   x.event.title = updated;
      // }
      // console.log(x.event.title);
      // console.log(events);


    },
    // eventDragStop: console.log,
    select: (x) => {
      console.log(x);
      myEvents.push(x);
      ec.setOption("events", myEvents);
      console.log(myEvents);
    },
    editable: true,
  };

  function _pad(num) {
    let norm = Math.floor(Math.abs(num));
    return (norm < 10 ? "0" : "") + norm;
  }

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

<div class="container" style="padding: 50px 0 100px 0">
    {#if !session}
    <Auth />
    {:else}
    <Account {session} />
    {/if}
  </div>

<!-- <Demo /> -->
