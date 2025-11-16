// script.js

// ---------- Calendar State ----------
let currentDate = new Date();
let events = JSON.parse(localStorage.getItem('zennedEvents') || '[]');

// ---------- DOM References ----------
const monthLabel = document.getElementById('currentMonth');
const calendarGrid = document.getElementById('calendarGrid');
const prevMonthBtn = document.getElementById('prevMonth');
const nextMonthBtn = document.getElementById('nextMonth');

// Date picker
const datePicker = document.getElementById('datePicker');
const datePickerMonthYear = document.getElementById('datePickerMonthYear');
const datePickerGrid = document.getElementById('datePickerGrid');
const datePrevMonth = document.getElementById('datePrevMonth');
const dateNextMonth = document.getElementById('dateNextMonth');
const datePickerToday = document.getElementById('datePickerToday');
const datePickerClose = document.getElementById('datePickerClose');

// Modals
const eventModal = document.getElementById('eventModal');
const importModal = document.getElementById('importModal');
const eventDetailsModal = document.getElementById('eventDetailsModal');
const editEventModal = document.getElementById('editEventModal');

// Buttons
const addEventBtn = document.getElementById('addEvent');
const importAIBtn = document.getElementById('importAI');
const collapseEventsBtn = document.getElementById('collapseEvents');

// Forms
const eventForm = document.getElementById('eventForm');
const editEventForm = document.getElementById('editEventForm');

// Upcoming events container
const upcomingEventsContent = document.getElementById('upcomingEventsContent');

// For details/edit/delete
let activeEventId = null;

// ---------- Utility ----------
function formatMonthYear(date) {
    return date.toLocaleString('default', { month: 'long', year: 'numeric' });
}

function formatDateKey(date) {
    return date.toISOString().split('T')[0]; // yyyy-mm-dd
}

function saveEvents() {
    localStorage.setItem('zennedEvents', JSON.stringify(events));
}

// ---------- Calendar Rendering ----------
function renderCalendar() {
    calendarGrid.innerHTML = '';

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    monthLabel.textContent = formatMonthYear(currentDate);

    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const startDay = firstDayOfMonth.getDay(); // 0-6

    const daysInMonth = lastDayOfMonth.getDate();

    // Previous month's trailing days
    const prevLastDay = new Date(year, month, 0).getDate();

    const todayKey = formatDateKey(new Date());

    const totalCells = 42; // 6 rows x 7 days
    let dayCounter = 1;
    let nextMonthDay = 1;

    for (let cell = 0; cell < totalCells; cell++) {
        const dayCell = document.createElement('div');
        dayCell.classList.add('calendar-day');

        const cellWrapper = document.createElement('div');
        cellWrapper.classList.add('day-header');

        const dayNumber = document.createElement('div');
        dayNumber.classList.add('day-number');

        let cellDate;
        let inCurrentMonth = false;

        if (cell < startDay) {
            // days from previous month
            const dayNum = prevLastDay - (startDay - 1 - cell);
            dayNumber.textContent = dayNum;
            dayCell.classList.add('other-month');
            cellDate = new Date(year, month - 1, dayNum);
        } else if (dayCounter <= daysInMonth) {
            // current month
            dayNumber.textContent = dayCounter;
            inCurrentMonth = true;
            cellDate = new Date(year, month, dayCounter);
            dayCounter++;
        } else {
            // next month
            dayNumber.textContent = nextMonthDay;
            dayCell.classList.add('other-month');
            cellDate = new Date(year, month + 1, nextMonthDay);
            nextMonthDay++;
        }

        const dateKey = formatDateKey(cellDate);

        if (dateKey === todayKey) {
            dayCell.classList.add('today');
        }

        cellWrapper.appendChild(dayNumber);
        dayCell.appendChild(cellWrapper);

        // Events for this date
        const eventsContainer = document.createElement('div');
        eventsContainer.classList.add('events-container');

        const dayEvents = events.filter(e => e.date === dateKey);
        dayEvents.forEach(evt => {
            const evtEl = document.createElement('div');
            evtEl.classList.add('event', `category-${evt.category}`);
            evtEl.textContent = evt.title;
            evtEl.addEventListener('click', () => openEventDetails(evt.id));
            eventsContainer.appendChild(evtEl);
        });

        dayCell.appendChild(eventsContainer);

        // Allow adding event by clicking empty area of current-month cells
        if (inCurrentMonth) {
            dayCell.addEventListener('dblclick', () => {
                openEventModal(dateKey);
            });
        }

        calendarGrid.appendChild(dayCell);
    }

    renderUpcomingEvents();
}

// ---------- Date Picker ----------
function renderDatePickerView(date = currentDate) {
    datePickerMonthYear.textContent = formatMonthYear(date);

    const tempDate = new Date(date);
    tempDate.setDate(1);

    const year = tempDate.getFullYear();
    const month = tempDate.getMonth();
    const firstDay = tempDate.getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const prevLastDay = new Date(year, month, 0).getDate();

    datePickerGrid.innerHTML = '';
    const totalCells = 42;
    let dayCounter = 1;
    let nextMonthDay = 1;

    for (let cell = 0; cell < totalCells; cell++) {
        const dayEl = document.createElement('div');
        dayEl.classList.add('date-picker-day');

        let cellDate;
        if (cell < firstDay) {
            const dayNum = prevLastDay - (firstDay - 1 - cell);
            dayEl.textContent = dayNum;
            dayEl.classList.add('other-month');
            cellDate = new Date(year, month - 1, dayNum);
        } else if (dayCounter <= daysInMonth) {
            dayEl.textContent = dayCounter;
            cellDate = new Date(year, month, dayCounter);
            dayCounter++;
        } else {
            dayEl.textContent = nextMonthDay;
            dayEl.classList.add('other-month');
            cellDate = new Date(year, month + 1, nextMonthDay);
            nextMonthDay++;
        }

        const dateKey = formatDateKey(cellDate);
        if (dateKey === formatDateKey(new Date())) {
            dayEl.classList.add('today');
        }

        dayEl.addEventListener('click', () => {
            currentDate = cellDate;
            renderCalendar();
            toggleDatePicker(false);
        });

        datePickerGrid.appendChild(dayEl);
    }
}

function toggleDatePicker(show) {
    if (!datePicker) return;
    if (show) {
        datePicker.classList.add('show');
        renderDatePickerView();
    } else {
        datePicker.classList.remove('show');
    }
}

// ---------- Modals ----------
function openModal(modal) {
    if (!modal) return;
    modal.classList.add('show');
}

function closeModal(modal) {
    if (!modal) return;
    modal.classList.remove('show');
}

// Add event modal
function openEventModal(dateKey = null) {
    // Prefill date if provided
    if (dateKey) {
        const dateInput = document.getElementById('eventDate');
        if (dateInput) dateInput.value = dateKey;
    }
    openModal(eventModal);
}

// Event details
function openEventDetails(id) {
    const evt = events.find(e => e.id === id);
    if (!evt) return;

    activeEventId = id;

    document.getElementById('eventDetailsTitle').textContent = evt.title;
    document.getElementById('eventDetailsDate').textContent = evt.date;
    document.getElementById('eventDetailsTime').textContent = evt.time || '—';
    document.getElementById('eventDetailsDescription').textContent = evt.description || '—';

    const badge = document.getElementById('eventCategoryBadge');
    badge.textContent = evt.category;
    badge.className = 'event-category category-' + evt.category;

    openModal(eventDetailsModal);
}

// ---------- Upcoming Events ----------
function renderUpcomingEvents() {
    if (!upcomingEventsContent) return;
    upcomingEventsContent.innerHTML = '';

    const now = new Date();
    const sorted = [...events].sort((a, b) => a.date.localeCompare(b.date));

    const upcoming = sorted.filter(e => new Date(e.date) >= now).slice(0, 8);

    if (upcoming.length === 0) {
        const empty = document.createElement('p');
        empty.textContent = 'No upcoming events yet.';
        empty.style.fontSize = '0.85rem';
        empty.style.color = '#8B6F4E';
        upcomingEventsContent.appendChild(empty);
        return;
    }

    upcoming.forEach(evt => {
        const wrapper = document.createElement('div');
        wrapper.classList.add('upcoming-event');

        const time = document.createElement('div');
        time.classList.add('event-time');
        time.textContent = `${evt.date}${evt.time ? ' • ' + evt.time : ''}`;

        const title = document.createElement('div');
        title.classList.add('event-title');
        title.textContent = evt.title;

        const badge = document.createElement('div');
        badge.classList.add('event-category', 'category-' + evt.category);
        badge.textContent = evt.category;

        wrapper.appendChild(time);
        wrapper.appendChild(title);
        wrapper.appendChild(badge);

        wrapper.addEventListener('click', () => openEventDetails(evt.id));

        upcomingEventsContent.appendChild(wrapper);
    });
}

// ---------- Event CRUD ----------
if (eventForm) {
    eventForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const title = document.getElementById('eventTitle').value.trim();
        const date = document.getElementById('eventDate').value;
        const time = document.getElementById('eventTime').value;
        const category = document.getElementById('eventCategory').value;
        const description = document.getElementById('eventDescription').value.trim();

        if (!title || !date) return;

        const newEvent = {
            id: Date.now().toString(),
            title,
            date,
            time,
            category,
            description
        };

        events.push(newEvent);
        saveEvents();
        renderCalendar();
        closeModal(eventModal);
        eventForm.reset();
    });
}

// Edit Event
if (editEventForm) {
    editEventForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!activeEventId) return;
        const evt = events.find(e => e.id === activeEventId);
        if (!evt) return;

        evt.title = document.getElementById('editEventTitle').value.trim();
        evt.date = document.getElementById('editEventDate').value;
        evt.time = document.getElementById('editEventTime').value;
        evt.category = document.getElementById('editEventCategory').value;
        evt.description = document.getElementById('editEventDescription').value.trim();

        saveEvents();
        renderCalendar();
        closeModal(editEventModal);
        closeModal(eventDetailsModal);
    });
}

// Buttons inside Event Details modal
const editEventBtn = document.getElementById('editEventBtn');
const deleteEventBtn = document.getElementById('deleteEventBtn');
const closeEventDetailsBtn = document.getElementById('closeEventDetailsBtn');
const closeEventDetailsIcon = document.getElementById('closeEventDetails');

if (editEventBtn) {
    editEventBtn.addEventListener('click', () => {
        const evt = events.find(e => e.id === activeEventId);
        if (!evt) return;

        document.getElementById('editEventTitle').value = evt.title;
        document.getElementById('editEventDate').value = evt.date;
        document.getElementById('editEventTime').value = evt.time;
        document.getElementById('editEventCategory').value = evt.category;
        document.getElementById('editEventDescription').value = evt.description;

        closeModal(eventDetailsModal);
        openModal(editEventModal);
    });
}

if (deleteEventBtn) {
    deleteEventBtn.addEventListener('click', () => {
        if (!activeEventId) return;
        if (!confirm('Delete this event?')) return;

        events = events.filter(e => e.id !== activeEventId);
        saveEvents();
        renderCalendar();
        closeModal(eventDetailsModal);
    });
}

if (closeEventDetailsBtn) {
    closeEventDetailsBtn.addEventListener('click', () => closeModal(eventDetailsModal));
}
if (closeEventDetailsIcon) {
    closeEventDetailsIcon.addEventListener('click', () => closeModal(eventDetailsModal));
}

// ---------- Other UI Listeners ----------
if (prevMonthBtn) {
    prevMonthBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar();
    });
}
if (nextMonthBtn) {
    nextMonthBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar();
    });
}

if (monthLabel) {
    monthLabel.addEventListener('click', () => toggleDatePicker(!datePicker.classList.contains('show')));
}

if (datePrevMonth) {
    datePrevMonth.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderDatePickerView(currentDate);
    });
}

if (dateNextMonth) {
    dateNextMonth.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderDatePickerView(currentDate);
    });
}

if (datePickerToday) {
    datePickerToday.addEventListener('click', () => {
        currentDate = new Date();
        renderCalendar();
        toggleDatePicker(false);
    });
}

if (datePickerClose) {
    datePickerClose.addEventListener('click', () => toggleDatePicker(false));
}

// Collapse upcoming events
if (collapseEventsBtn && upcomingEventsContent) {
    collapseEventsBtn.addEventListener('click', () => {
        upcomingEventsContent.classList.toggle('hidden');
        collapseEventsBtn.querySelector('i').classList.toggle('fa-chevron-down');
        collapseEventsBtn.querySelector('i').classList.toggle('fa-chevron-up');
    });
}

// Import AI modal (stub)
if (importAIBtn && importModal) {
    importAIBtn.addEventListener('click', () => openModal(importModal));
    const closeImportModal = document.getElementById('closeImportModal');
    const cancelImport = document.getElementById('cancelImport');
    if (closeImportModal) closeImportModal.addEventListener('click', () => closeModal(importModal));
    if (cancelImport) cancelImport.addEventListener('click', () => closeModal(importModal));
}

// Add Event button
if (addEventBtn) {
    addEventBtn.addEventListener('click', () => openEventModal());
}

// Close buttons for other modals
const closeModalButtons = [
    document.getElementById('closeModal'),
    document.getElementById('cancelEvent'),
    document.getElementById('closeEditModal'),
    document.getElementById('cancelEdit')
];

closeModalButtons.forEach(btn => {
    if (!btn) return;
    btn.addEventListener('click', () => {
        closeModal(eventModal);
        closeModal(editEventModal);
    });
});

// --- View toggle behavior (Day / Week / Month) ---
const viewOptions = document.querySelectorAll('.view-option');
const viewIndicator = document.querySelector('.view-indicator');

if (viewOptions.length && viewIndicator) {
    viewOptions.forEach((option, index) => {
        option.addEventListener('click', () => {
            // Update active state
            viewOptions.forEach(o => o.classList.remove('active'));
            option.classList.add('active');

            // Slide the indicator under the selected option
            const offset = index * 100; // 0%, 100%, 200%
            viewIndicator.style.transform = `translateX(${offset}%) translateY(-50%)`;

        });
    });
}


// Initial render
renderCalendar();


