import React, { useEffect, useRef } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'

export default function CalendarPage({ API, employeeId, employees }) {
  function eventsFetcher(info, successCallback, failureCallback) {
    let url = `${API}/api/events`
    if (employeeId) url += `?employeeId=${employeeId}`
    fetch(url).then(r=>r.json()).then(successCallback).catch(failureCallback)
  }

  return (
    <div>
      <h3>Team Calendar</h3>
      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        events={eventsFetcher}
        height="auto"
      />
    </div>
  )
}
