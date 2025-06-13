"use strict";

// Course Data
const courses = [
  {
    id: 'six-sigma-yellow',
    title: "Six Sigma Yellow Belt Certification",
    duration: 30,
    hours: 6,
    startDate: "2024-04-01",
    description: "This course introduces core Six Sigma concepts focused on process improvement and quality control."
  },
  {
    id: 'lean-green-belt',
    title: "Lean Six Sigma Green Belt Certification",
    duration: 180,
    hours: 40,
    startDate: "2024-03-01",
    description: "Deeper dive into Lean and Six Sigma principles for data-driven decision-making."
  },
  {
    id: 'lean-black-belt',
    title: "Lean Six Sigma Black Belt Certification",
    duration: 180,
    hours: 40,
    startDate: "2024-03-01",
    description: "Advanced problem-solving and leadership for process improvements."
  },
  {
    id: 'agile-master',
    title: "Agile Master Certification",
    duration: 180,
    hours: 40,
    startDate: "2024-04-01",
    description: "Master Agile methodologies with focus on team dynamics and execution."
  }
];

// Connections Data
let connections = [
  {id: 'c1', name: 'Alice Johnson', initials: 'AJ'},
  {id: 'c2', name: 'Brian Lee', initials: 'BL'},
  {id: 'c3', name: 'Christopher Smith', initials: 'CS'}
];

// Work Diary Entries
let workDiaryEntries = [
  {id: 'd1', date: '2024-04-14', courseId: 'six-sigma-yellow', content: 'Reviewed DMAIC methodology and core tools.'},
  {id: 'd2', date: '2024-04-13', courseId: 'lean-green-belt', content: 'Completed exercises on process mapping.'},
  {id: 'd3', date: '2024-04-25', courseId: 'agile-master', content: 'Upcoming: Review Agile ceremonies and practices.'}
];

// Generate Study Sessions
function generateStudySessions() {
  const sessions = [];
  courses.forEach(course => {
    let start = new Date(course.startDate);
    let countSessions = course.hours;
    let addedSessions = 0;
    let dayMs = 24*60*60*1000;
    
    while(addedSessions < countSessions) {
      let dayOfWeek = start.getDay();
      if(dayOfWeek !== 0 && dayOfWeek !== 6) {
        sessions.push({
          id: course.id + '-sess-' + addedSessions,
          date: start.toISOString().slice(0,10),
          courseId: course.id,
          status: 'scheduled',
          location: 'Training Room 4'
        });
        addedSessions++;
      }
      start = new Date(start.getTime() + dayMs);
    }
  });
  return sessions;
}

let studySessions = generateStudySessions();

// Helper Functions
function formatDate(iso) {
  const opts = {year: 'numeric', month: 'short', day: 'numeric'};
  return new Date(iso).toLocaleDateString(undefined, opts);
}

function createElement(tag, attrs = {}, ...children) {
  const el = document.createElement(tag);
  for (const attr in attrs) {
    if (attr === 'className') el.className = attrs[attr];
    else if (attr.startsWith('aria')) el.setAttribute(attr, attrs[attr]);
    else if (attr === 'html') el.innerHTML = attrs[attr];
    else el.setAttribute(attr, attrs[attr]);
  }
  children.forEach(child => {
    if (typeof child === 'string') el.appendChild(document.createTextNode(child));
    else if (child) el.appendChild(child);
  });
  return el;
}

// Render Functions
function renderCourses() {
  const container = createElement('div', {className: 'course-list', role:'list'});
  
  courses.forEach(course => {
    if (!shouldShowContent(course.id)) return;
    const card = createElement('article', {className: 'course-card', role:'listitem', tabindex:'0'});
    const title = createElement('h3', {}, course.title);
    const info = createElement('div', {className: 'course-info'}, 
      createElement('div', {ariaLabel: "Duration"}, `Duration: ${course.duration} days`),
      createElement('div', {ariaLabel: "Study Hours"}, `Study Hours: ${course.hours} hours`),
      createElement('div', {ariaLabel: "Start Date"}, `Start Date: ${formatDate(course.startDate)}`)
    );
    const description = createElement('p', {className: 'course-description'}, course.description);
    const enrollBtn = createElement('button', {
      className: 'btn-enroll', 
      'aria-label': `Choose Course ${course.title}`, 
      type: 'button'
    }, 'Choose Course');
    
    enrollBtn.addEventListener('click', () => alert(`Choose course: "${course.title}"`));
    
    card.append(title, info, description, enrollBtn);
    container.appendChild(card);
  });
  
  return container;
}

// Add time property to study sessions for demo purposes
function assignSessionTimes() {
  const times = ['08:00', '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00'];
  let index = 0;
  studySessions.forEach(session => {
    session.time = times[index % times.length];
    index++;
  });
}

// Call this once to assign times
assignSessionTimes();

// Render Study Diary Calendar with hourly blocks
function renderStudyDiaryCalendar() {
  const container = createElement('section', {className: 'study-diary-calendar'});
  const header = createElement('h2', {className: 'calendar-header'}, 'Study Diary');
  container.appendChild(header);

  const startHour = 8;
  const endHour = 20;

  for(let hour = startHour; hour <= endHour; hour++) {
    const hourLabel = (hour < 10 ? '0' + hour : hour) + ':00';
    const timeBlock = createElement('div', {className: 'time-block'});
    const timeLabel = createElement('div', {className: 'time-label'}, hourLabel);
    timeBlock.appendChild(timeLabel);

    const sessionsInBlock = studySessions.filter(s => s.time === hourLabel && shouldShowContent(s.courseId));
    sessionsInBlock.forEach(session => {
      const course = courses.find(c => c.id === session.courseId);
      const event = createElement('div', {
        className: 'session-event',
        title: `${course ? course.title : 'Unknown session'} - ${session.status}`
      }, course ? course.title : 'Unknown');
      timeBlock.appendChild(event);
    });

    container.appendChild(timeBlock);
  }

  return container;
}

// Update renderAppSection to use new calendar rendering
function renderAppSection(section) {
  const appContent = document.getElementById('app-content');
  appContent.innerHTML = '';

  switch(section) {
    case 'courses':
      appContent.appendChild(renderCourses());
      break;
    case 'work-diary':
      appContent.appendChild(renderWorkDiary());
      break;
    case 'connections':
      appContent.appendChild(renderConnections());
      break;
    case 'calendar':
      appContent.appendChild(renderStudyDiaryCalendar());
      break;
    default:
      appContent.appendChild(renderCourses());
  }

  // Update active navigation button
  document.querySelectorAll('nav.bottom-nav button').forEach(btn => 
    btn.classList.remove('active')
  );
  const activeBtn = document.getElementById('nav-' + section);
  if(activeBtn) activeBtn.classList.add('active');
  currentSection = section;
}

function renderWorkDiary() {
  const container = createElement('section', {className:'work-diary'});
  const title = createElement('h2', {className:'section-title'}, 'Work Diary & Study Sessions');

  // Upcoming Sessions
  const now = new Date();
  const upcomingSessions = studySessions
    .filter(s => {
      const isScheduled = s.status === 'scheduled';
      const isFuture = new Date(s.date + 'T00:00:00') >= new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const matchesFilter = shouldShowContent(s.courseId);
      return isScheduled && isFuture && matchesFilter;
    })
    .sort((a,b) => new Date(a.date) - new Date(b.date))
    .slice(0,3);

  const reminderBox = createElement('div', {className:'diary-reminder', role: 'region', 'aria-live': 'polite'});
  if(upcomingSessions.length === 0) {
    reminderBox.appendChild(createElement('h3', {}, 'No upcoming study sessions.'));
  } else {
    reminderBox.appendChild(createElement('h3', {}, 'Upcoming Study Reminders:'));
    upcomingSessions.forEach(session => {
      const course = courses.find(c => c.id === session.courseId);
      const p = createElement('p', {}, 
        `${formatDate(session.date)}: ${course ? course.title : 'Unknown Course'} (${session.location})`
      );
      reminderBox.appendChild(p);
    });
  }

  // Study Sessions List
  const sessionList = createElement('div', {className:'study-sessions-list', role: 'list'});
  if(studySessions.length === 0) {
    sessionList.appendChild(createElement('p', {}, 'No study sessions found.'));
  } else {
    const sortedSessions = [...studySessions]
      .filter(s => shouldShowContent(s.courseId))
      .sort((a,b) => new Date(a.date) - new Date(b.date));
    sortedSessions.forEach(session => {
      const course = courses.find(c => c.id === session.courseId);
      const item = createElement('article', {className:'session-item', role:'listitem', tabindex:'0'});
      
      const dateDiv = createElement('div', {className:'session-date'}, formatDate(session.date));
      const courseDiv = createElement('div', {className:'session-course'}, course ? course.title : 'Unknown Course');
      const locationDiv = createElement('div', {className:'session-location'}, session.location);
      const statusDiv = createElement('div', {
        className: `session-status status-${session.status}`,
      }, session.status.charAt(0).toUpperCase() + session.status.slice(1));

      const actionsDiv = createElement('div', {className:'session-actions'});
      
      if(session.status !== 'completed') {
        const btnComplete = createElement('button', {
          className:'btn-mark-completed',
          type:'button',
          'aria-label': `Mark session on ${formatDate(session.date)} as completed`
        }, 'Complete');
        
        btnComplete.addEventListener('click', () => {
          session.status = 'completed';
          renderAppSection(currentSection);
        });
        
        actionsDiv.appendChild(btnComplete);
      }

      if(session.status !== 'missed') {
        const btnMissed = createElement('button', {
          className:'btn-mark-missed',
          type:'button',
          'aria-label': `Mark session on ${formatDate(session.date)} as missed`
        }, 'Missed');
        
        btnMissed.addEventListener('click', () => {
          session.status = 'missed';
          renderAppSection(currentSection);
        });
        
        actionsDiv.appendChild(btnMissed);
      }

      if(session.status === 'missed') {
        const btnReschedule = createElement('button', {
          className:'btn-reschedule',
          type:'button',
          'aria-label': `Reschedule session on ${formatDate(session.date)}`
        }, 'Reschedule');
        
        btnReschedule.addEventListener('click', () => openRescheduleModal(session));
        actionsDiv.appendChild(btnReschedule);
      }

      item.append(dateDiv, courseDiv, locationDiv, statusDiv, actionsDiv);
      sessionList.appendChild(item);
    });
  }

  // Diary Entries
  const diaryTitle = createElement('h2', {className:'section-title'}, 'Diary Notes');
  const entryList = createElement('div', {className:'diary-entry-list', 'aria-live': 'polite', role: 'list'});
  
  if(workDiaryEntries.length === 0) {
    entryList.appendChild(createElement('p', {}, 'No work diary entries yet.'));
  } else {
    workDiaryEntries
      .filter(entry => shouldShowContent(entry.courseId))
      .forEach(entry => {
        const course = courses.find(c => c.id === entry.courseId);
        const entryEl = createElement('article', {className:'diary-entry', role:'listitem', tabindex:'0'});
        const header = createElement('div', {className:'diary-entry-header'}, 
          `${formatDate(entry.date)} - ${course ? course.title : 'Unknown Course'}`
        );
        const content = createElement('p', {}, entry.content);
        entryEl.append(header, content);
        entryList.appendChild(entryEl);
      });
  }

  const addBtn = createElement('button', {
    className:'add-entry-btn',
    type:'button',
    'aria-label': 'Add new diary entry'
  }, 'Add Entry');
  
  addBtn.addEventListener('click', () => openAddDiaryModal());

  container.append(title, reminderBox, sessionList, diaryTitle, entryList, addBtn);
  return container;
}

function renderConnections() {
  const container = createElement('section', {className:'connections'});
  const title = createElement('h2', {className:'section-title'}, 'Study Partners');
  
  const connectionList = createElement('div', {className:'connection-list', role:'list'});
  
  if(connections.length === 0) {
    connectionList.appendChild(createElement('p', {}, 'No study partners added yet.'));
  } else {
    connections.forEach(conn => {
      const item = createElement('article', {className:'connection-item', role:'listitem', tabindex:'0'});
      const info = createElement('div', {className:'connection-info'});
      const avatar = createElement('div', {className:'avatar', 'aria-hidden':'true'}, conn.initials);
      const name = createElement('div', {className:'connection-name'}, conn.name);
      
      info.append(avatar, name);
      
      const removeBtn = createElement('button', {
        className:'btn-remove-connection',
        'aria-label': `Remove ${conn.name}`,
        type:'button'
      }, 'Remove');
      
      removeBtn.addEventListener('click', () => {
        if(confirm(`Remove study partner: ${conn.name}?`)) {
          connections = connections.filter(c => c.id !== conn.id);
          renderAppSection(currentSection);
        }
      });
      
      item.append(info, removeBtn);
      connectionList.appendChild(item);
    });
  }

  const addBtn = createElement('button', {
    className:'btn-add-connection',
    type:'button',
    'aria-label': 'Add new study partner'
  }, 'Add Study Partner');
  
  addBtn.addEventListener('click', () => alert('Add Study Partner functionality not implemented in this demo.'));
  
  container.append(title, connectionList, addBtn);
  return container;
}

function renderCalendar() {
  const container = createElement('section', {className:'calendar'});
  const title = createElement('h2', {className:'calendar-header'}, 'Shared Work Calendar');

  const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const weekdayHeader = createElement('div', {className: 'calendar-weekdays'});
  
  weekdays.forEach(day => {
    weekdayHeader.appendChild(createElement('div', {className: 'calendar-weekday'}, day));
  });

  const calendarGrid = createElement('div', {className:'calendar-grid', role:'list'});

  // Calendar setup (April 2024)
  const year = 2024;
  const month = 3; // April
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = 30;
  const firstDayOfWeek = firstDay === 0 ? 7 : firstDay;

  // Add empty cells for days before the 1st
  for(let i=1; i < firstDayOfWeek; i++) {
    const emptyCell = createElement('div', {
      className:'calendar-day',
      'aria-hidden':'true'
    });
    calendarGrid.appendChild(emptyCell);
  }

  // Add calendar days
  for(let day=1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${String(month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
    const dayCell = createElement('article', {className:'calendar-day', role:'listitem', tabindex:'0'});
    
    dayCell.appendChild(createElement('div', {className:'day-number'}, String(day)));
    
    // Create events container
    const eventsContainer = createElement('div', {className:'events-container'});
    
    // Add study sessions for this day
    const daySessions = studySessions
      .filter(s => s.date === dateStr && shouldShowContent(s.courseId));
    
    daySessions.forEach(session => {
      const course = courses.find(c => c.id === session.courseId);
      if (course) {
        const eventDiv = createElement('div', {
          className: `calendar-event ${session.status}`,
          title: `${course.title} - ${session.status}`,
        }, course.title);
        eventsContainer.appendChild(eventDiv);
      }
    });
    
    dayCell.appendChild(eventsContainer);
    calendarGrid.appendChild(dayCell);
  }

  container.append(title, weekdayHeader, calendarGrid);
  return container;
}

// Modal Functions
function openRescheduleModal(session) {
  if(document.getElementById('reschedule-modal')) return;
  
  const modal = createElement('div', {
    className:'add-entry-modal',
    id:'reschedule-modal',
    role:'dialog',
    'aria-modal':'true',
    'aria-labelledby':'reschedule-modal-title'
  });
  
  const content = createElement('div', {className:'add-entry-modal-content'});
  const title = createElement('h3', {id:'reschedule-modal-title'}, `Reschedule session for ${formatDate(session.date)}`);

  const form = createElement('form', {
    id:'reschedule-form',
    'aria-label': 'Reschedule missed session form'
  });

  const labelDate = createElement('label', {for:'new-date'}, 'New Date');
  const inputDate = createElement('input', {
    type:'date',
    id:'new-date',
    name:'new-date',
    required:true
  });

  // Set minimum date to tomorrow
  let tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  inputDate.min = tomorrow.toISOString().slice(0,10);

  const labelLocation = createElement('label', {for:'new-location'}, 'Study Location');
  const inputLocation = createElement('input', {
    type:'text',
    id:'new-location',
    name:'new-location',
    required:true,
    value: session.location || ''
  });

  const actions = createElement('div', {className:'modal-actions'});
  const cancelBtn = createElement('button', {
    type:'button',
    className:'modal-button cancel'
  }, 'Cancel');
  
  const submitBtn = createElement('button', {
    type:'submit',
    className:'modal-button submit'
  }, 'Reschedule');

  cancelBtn.addEventListener('click', () => {
    document.body.removeChild(modal);
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    const newDateVal = inputDate.value;
    const newLocVal = inputLocation.value.trim();
    
    if(newDateVal && newLocVal) {
      rescheduleMissedSession(session, newDateVal, newLocVal);
      document.body.removeChild(modal);
      renderAppSection(currentSection);
    }
  });

  actions.append(cancelBtn, submitBtn);
  form.append(labelDate, inputDate, labelLocation, inputLocation, actions);
  content.append(title, form);
  modal.appendChild(content);
  document.body.appendChild(modal);
  inputDate.focus();
}

function rescheduleMissedSession(oldSession, newDateStr, newLocation) {
  const conflictingSession = studySessions.find(s => 
    s !== oldSession && 
    s.courseId === oldSession.courseId && 
    s.date === newDateStr
  );
  
  if(conflictingSession) {
    alert('Selected new date conflicts with another study session for this course. Please pick another date.');
    return;
  }
  
  oldSession.date = newDateStr;
  oldSession.location = newLocation;
  oldSession.status = 'scheduled';
}

function openAddDiaryModal() {
  if(document.getElementById('add-entry-modal')) return;
  
  const modal = createElement('div', {
    className:'add-entry-modal',
    id:'add-entry-modal',
    role:'dialog',
    'aria-modal':'true',
    'aria-labelledby':'modal-title'
  });
  
  const content = createElement('div', {className:'add-entry-modal-content'});
  const title = createElement('h3', {id:'modal-title'}, 'Add Diary Entry');
  
  const form = createElement('form', {
    id:'add-entry-form',
    'aria-label': 'Add new diary entry form'
  });

  const labelDate = createElement('label', {for:'entry-date'}, 'Date');
  const inputDate = createElement('input', {
    type:'date',
    id:'entry-date',
    name:'date',
    required: true,
    max: new Date().toISOString().split('T')[0]
  });

  const labelCourse = createElement('label', {for:'entry-course'}, 'Course');
  const selectCourse = createElement('select', {
    id: 'entry-course',
    name:'course',
    required:true
  });
  
  courses.forEach(c => {
    selectCourse.appendChild(createElement('option', {value:c.id}, c.title));
  });

  const labelContent = createElement('label', {for:'entry-content'}, 'Content');
  const textareaContent = createElement('textarea', {
    id:'entry-content',
    name:'content',
    placeholder:'Add notes or progress details...',
    required: true
  });

  const actions = createElement('div', {className:'modal-actions'});
  const cancelBtn = createElement('button', {
    type:'button',
    className:'modal-button cancel'
  }, 'Cancel');
  
  const submitBtn = createElement('button', {
    type:'submit',
    className:'modal-button submit'
  }, 'Add');

  cancelBtn.addEventListener('click', () => {
    document.body.removeChild(modal);
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    const date = inputDate.value;
    const courseId = selectCourse.value;
    const content = textareaContent.value.trim();
    
    if(date && courseId && content) {
      workDiaryEntries.unshift({
        id: `d${Date.now()}`,
        date,
        courseId,
        content
      });
      document.body.removeChild(modal);
      renderAppSection(currentSection);
    }
  });

  actions.append(cancelBtn, submitBtn);
  form.append(labelDate, inputDate, labelCourse, selectCourse, labelContent, textareaContent, actions);
  content.append(title, form);
  modal.appendChild(content);
  document.body.appendChild(modal);
  inputDate.focus();
}

// App Section Rendering
function renderAppSection(section) {
  const appContent = document.getElementById('app-content');
  appContent.innerHTML = '';

  switch(section) {
    case 'courses':
      appContent.appendChild(renderCourses());
      break;
    case 'work-diary':
      appContent.appendChild(renderWorkDiary());
      break;
    case 'connections':
      appContent.appendChild(renderConnections());
      break;
    case 'calendar':
      appContent.appendChild(renderStudyDiaryCalendar());
      break;
    default:
      appContent.appendChild(renderCourses());
  }

  // Update active navigation button
  document.querySelectorAll('nav.bottom-nav button').forEach(btn => 
    btn.classList.remove('active')
  );
  const activeBtn = document.getElementById('nav-' + section);
  if(activeBtn) activeBtn.classList.add('active');
  currentSection = section;
}

// Navigation Setup
function setupNavListeners() {
  document.getElementById('nav-courses').addEventListener('click', () => renderAppSection('courses'));
  document.getElementById('nav-work-diary').addEventListener('click', () => renderAppSection('work-diary'));
  document.getElementById('nav-connections').addEventListener('click', () => renderAppSection('connections'));
  document.getElementById('nav-calendar').addEventListener('click', () => renderAppSection('calendar'));
}

// Initialize
let currentSection = 'courses';
let selectedCourseId = '';

// Populate course filter
function populateCourseFilter() {
  const filter = document.getElementById('course-filter');
  filter.innerHTML = '<option value="">All Courses</option>';
  courses.forEach(course => {
    const option = createElement('option', { value: course.id }, course.title);
    filter.appendChild(option);
  });
}

// Filter content based on selected course
function filterContent(courseId) {
  selectedCourseId = courseId;
  renderAppSection(currentSection);
}

// Update render functions to respect course filter
function shouldShowContent(courseId) {
  return !selectedCourseId || courseId === selectedCourseId;
}

document.addEventListener('DOMContentLoaded', () => {
  populateCourseFilter();
  renderAppSection(currentSection);
  setupNavListeners();
  
  // Add course filter listener
  document.getElementById('course-filter').addEventListener('change', (e) => {
    filterContent(e.target.value);
  });
});
