const seed = {
  organizations: [
    { id: 1, name: 'Information Technology Club', short: 'IT Club', description: 'A student community for technology, programming, innovation, and digital skills.', president: 'Alex Student', adviser: 'Prof. Maria Santos', email: 'itclub@orgconnect.edu', phone: '+63 917 123 4567', members: 35, established: 2022, status: 'Active', initials: 'IT' },
    { id: 2, name: 'Student Leaders Association', short: 'SLA', description: 'Developing responsible student leaders through service, collaboration, and leadership programs.', president: 'Jamie Cruz', adviser: 'Dr. Carlo Reyes', email: 'sla@orgconnect.edu', phone: '+63 918 222 3388', members: 48, established: 2021, status: 'Active', initials: 'SL' },
    { id: 3, name: 'MDC Arts and Culture Society', short: 'Arts & Culture', description: 'Celebrating creativity, culture, performance, and visual arts across the campus community.', president: 'Sofia Lim', adviser: 'Ms. Elena Garcia', email: 'arts@orgconnect.edu', phone: '+63 919 333 4499', members: 27, established: 2023, status: 'Active', initials: 'AC' }
  ],
  members: [
    { id: 1, name: 'Alex Student', studentId: '2026-00124', course: 'BS Information Technology', year: '3rd Year', position: 'President', organization: 'Information Technology Club', email: 'student@orgconnect.com' },
    { id: 2, name: 'Jamie Cruz', studentId: '2025-00831', course: 'BS Business Administration', year: '4th Year', position: 'President', organization: 'Student Leaders Association', email: 'jamie@example.edu' },
    { id: 3, name: 'Sofia Lim', studentId: '2026-00415', course: 'BA Communication', year: '2nd Year', position: 'President', organization: 'MDC Arts and Culture Society', email: 'sofia@example.edu' },
    { id: 4, name: 'Miguel Santos', studentId: '2026-00671', course: 'BS Information Technology', year: '3rd Year', position: 'Vice President', organization: 'Information Technology Club', email: 'miguel@example.edu' },
    { id: 5, name: 'Bea Reyes', studentId: '2025-00218', course: 'BS Psychology', year: '4th Year', position: 'Secretary', organization: 'Student Leaders Association', email: 'bea@example.edu' }
  ],
  events: [
    { id: 1, title: 'Student Leadership Summit', date: '2026-09-30', time: '09:00', endTime: '16:00', location: 'MDC Activity Center', organization: 'Student Leaders Association', status: 'Upcoming', description: 'A full-day leadership development summit for student officers.' },
    { id: 2, title: 'Tech Talk: Building with Vue', date: '2026-10-05', time: '13:30', endTime: '15:30', location: 'Innovation Lab', organization: 'Information Technology Club', status: 'Upcoming', description: 'An introductory session on modern Vue.js application development.' },
    { id: 3, title: 'Organization Fair', date: '2026-10-12', time: '10:00', endTime: '17:00', location: 'Main Quadrangle', organization: 'Student Affairs Office', status: 'Upcoming', description: 'Discover student organizations and meet campus communities.' }
  ],
  announcements: [
    { id: 1, title: 'Organization Renewal Period', organization: 'Student Affairs Office', date: '2026-09-28', body: 'All recognized organizations are reminded to submit their annual renewal documents before the deadline.', status: 'Important' },
    { id: 2, title: 'Leadership Summit Registration', organization: 'Student Leaders Association', date: '2026-09-25', body: 'Registration is now open for the Student Leadership Summit. Slots are limited.', status: 'New' },
    { id: 3, title: 'Vue Workshop Next Week', organization: 'Information Technology Club', date: '2026-09-22', body: 'Bring your laptop and prepare for a hands-on introduction to Vue 3.', status: 'New' }
  ]
}

const key = (name) => `orgconnect_${name}`

export function loadData(name) {
  const saved = localStorage.getItem(key(name))
  if (saved) return JSON.parse(saved)
  const value = structuredClone(seed[name])
  localStorage.setItem(key(name), JSON.stringify(value))
  return value
}

export function saveData(name, value) {
  localStorage.setItem(key(name), JSON.stringify(value))
}

export function nextId(items) {
  return items.length ? Math.max(...items.map(i => Number(i.id))) + 1 : 1
}

export function resetAllData() {
  Object.keys(seed).forEach(name => localStorage.setItem(key(name), JSON.stringify(structuredClone(seed[name]))))
}
