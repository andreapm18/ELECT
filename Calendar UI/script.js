// Calendar functionality
let currentDate = new Date();
let events = [];
let datePickerCurrentDate = new Date();
let currentEditingEventId = null;

// DOM Elements
const calendarGrid = document.getElementById('calendarGrid');
const currentMonthElement = document.getElementById('currentMonth');
const prevMonthBtn = document.getElementById('prevMonth');
const nextMonthBtn = document.getElementById('nextMonth');
const addEventBtn = document.getElementById('addEvent');
const importAIBtn = document.getElementById('importAI');
const eventModal = document.getElementById('eventModal');
const importModal = document.getElementById('importModal');
const eventDetailsModal = document.getElementById('eventDetailsModal');
const editEventModal = document.getElementById('editEventModal');
const closeModalBtn = document.getElementById('closeModal');
const closeImportModalBtn = document.getElementById('closeImportModal');
const closeEventDetails = document.getElementById('closeEventDetails');
const closeEventDetailsBtn = document.getElementById('closeEventDetailsBtn');
const closeEditModal = document.getElementById('closeEditModal');
const cancelEventBtn = document.getElementById('cancelEvent');
const cancelImportBtn = document.getElementById('cancelImport');
const cancelEdit = document.getElementById('cancelEdit');
const eventForm = document.getElementById('eventForm');
const editEventForm = document.getElementById('editEventForm');
const processImportBtn = document.getElementById('processImport');
const deleteEventBtn = document.getElementById('deleteEventBtn');
const editEventBtn = document.getElementById('editEventBtn');
const monthDropdownTrigger = document.getElementById('currentMonth');
const datePicker = document.getElementById('datePicker');
const datePickerMonthYear = document.getElementById('datePickerMonthYear');
const datePrevMonth = document.getElementById('datePrevMonth');
const dateNextMonth = document.getElementById('dateNextMonth');
const datePickerGrid = document.getElementById('datePickerGrid');
const datePickerToday = document.getElementById('datePickerToday');
const datePickerClose = document.getElementById('datePickerClose');

// Initialize calendar
function initCalendar() {
    renderCalendar(currentDate);
    setupEventListeners();
}

// Render calendar for the given month
function renderCalendar(date) {
    const year = date.getFullYear();
    const month = date.getMonth();
    
    // Update current month display
    currentMonthElement.textContent = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    
    // Clear previous calendar
    calendarGrid.innerHTML = '';
    
    // Get first day of month and number of days
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();
    
    // Previous month days
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = 0; i < startingDay; i++) {
        const dayElement = createDayElement(prevMonthLastDay - startingDay + i + 1, true);
        calendarGrid.appendChild(dayElement);
    }
    
    // Current month days
    const today = new Date();
    for (let i = 1; i <= daysInMonth; i++) {
        const dayElement = createDayElement(i, false);
        
        // Check if this day is today
        if (today.getDate() === i && 
            today.getMonth() === month && 
            today.getFullYear() === year) {
            dayElement.classList.add('today');
        }
        
        calendarGrid.appendChild(dayElement);
    }
    
    // Next month days
    const totalCells = 42; // 6 weeks
    const remainingCells = totalCells - (startingDay + daysInMonth);
    for (let i = 1; i <= remainingCells; i++) {
        const dayElement = createDayElement(i, true);
        calendarGrid.appendChild(dayElement);
    }
    
    // Add events to calendar
    renderEvents();
}

// Create a day element
function createDayElement(dayNumber, isOtherMonth) {
    const dayElement = document.createElement('div');
    dayElement.className = 'calendar-day';
    
    if (isOtherMonth) {
        dayElement.classList.add('other-month');
    }
    
    const dayHeader = document.createElement('div');
    dayHeader.className = 'day-header';
    
    const dayNumberElement = document.createElement('div');
    dayNumberElement.className = 'day-number';
    dayNumberElement.textContent = dayNumber;
    
    const eventsContainer = document.createElement('div');
    eventsContainer.className = 'events-container';
    
    dayHeader.appendChild(dayNumberElement);
    dayElement.appendChild(dayHeader);
    dayElement.appendChild(eventsContainer);
    
    return dayElement;
}

// Render events on the calendar
function renderEvents() {
    // Clear existing events from calendar
    document.querySelectorAll('.event').forEach(event => event.remove());
    
    // Add events to their respective days
    events.forEach((event, index) => {
        const eventDate = new Date(event.date);
        const dayElements = document.querySelectorAll('.calendar-day:not(.other-month)');
        
        dayElements.forEach(dayElement => {
            const dayNumber = parseInt(dayElement.querySelector('.day-number').textContent);
            
            if (dayNumber === eventDate.getDate() && 
                eventDate.getMonth() === currentDate.getMonth() && 
                eventDate.getFullYear() === currentDate.getFullYear()) {
                
                const eventsContainer = dayElement.querySelector('.events-container');
                const eventElement = document.createElement('div');
                eventElement.className = `event category-${event.category}`;
                eventElement.textContent = event.title;
                eventElement.style.borderLeftColor = `var(--category-${event.category})`;
                eventElement.style.backgroundColor = `var(--category-${event.category})20`;
                
                // Add event ID for editing
                eventElement.dataset.eventId = index;
                
                eventElement.addEventListener('click', () => {
                    showEventDetails(event, index);
                });
                
                eventsContainer.appendChild(eventElement);
            }
        });
    });
}

// Show event details in modal
function showEventDetails(event, eventIndex) {
    document.getElementById('eventDetailsTitle').textContent = event.title;
    document.getElementById('eventDetailsDate').textContent = new Date(event.date).toLocaleDateString();
    document.getElementById('eventDetailsTime').textContent = event.time || 'All day';
    document.getElementById('eventDetailsDescription').textContent = event.description || 'No description';
    
    const categoryBadge = document.getElementById('eventCategoryBadge');
    categoryBadge.textContent = event.category.charAt(0).toUpperCase() + event.category.slice(1);
    categoryBadge.className = `event-category category-${event.category}`;
    
    // Store the current event for deletion AND editing
    deleteEventBtn.dataset.eventIndex = eventIndex;
    currentEditingEventId = eventIndex; // Store for editing
    
    eventDetailsModal.style.display = 'flex';
    setTimeout(() => {
        eventDetailsModal.classList.add('show');
    }, 10);
}

// Delete event function
function deleteEvent(eventIndex) {
    if (confirm('Are you sure you want to delete this event?')) {
        events.splice(eventIndex, 1);
        renderEvents();
        eventDetailsModal.classList.remove('show');
        setTimeout(() => {
            eventDetailsModal.style.display = 'none';
        }, 300);
        alert('Event deleted successfully!');
    }
}

// Edit event function
function editEvent(eventIndex) {
    const event = events[eventIndex];
    
    if (event) {
        // Populate the edit form with current event data
        document.getElementById('editEventTitle').value = event.title;
        document.getElementById('editEventDate').value = event.date;
        document.getElementById('editEventTime').value = event.time || '';
        document.getElementById('editEventDescription').value = event.description || '';
        document.getElementById('editEventCategory').value = event.category;
        
        // Show the edit modal
        editEventModal.style.display = 'flex';
        setTimeout(() => {
            editEventModal.classList.add('show');
        }, 10);
    }
}

// Update event function
function updateEvent(eventIndex) {
    const event = events[eventIndex];
    
    if (event) {
        // Update the event with new data
        events[eventIndex] = {
            ...event,
            title: document.getElementById('editEventTitle').value,
            date: document.getElementById('editEventDate').value,
            time: document.getElementById('editEventTime').value,
            description: document.getElementById('editEventDescription').value,
            category: document.getElementById('editEventCategory').value
        };
        
        // Re-render events
        renderEvents();
        
        // Close modals
        editEventModal.classList.remove('show');
        eventDetailsModal.classList.remove('show');
        setTimeout(() => {
            editEventModal.style.display = 'none';
            eventDetailsModal.style.display = 'none';
        }, 300);
        
        alert('Event updated successfully!');
    }
}

// Render date picker
function renderDatePicker() {
    const year = datePickerCurrentDate.getFullYear();
    const month = datePickerCurrentDate.getMonth();
    
    datePickerMonthYear.textContent = datePickerCurrentDate.toLocaleDateString('en-US', { 
        month: 'long', 
        year: 'numeric' 
    });
    
    datePickerGrid.innerHTML = '';
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();
    
    // Previous month days
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = 0; i < startingDay; i++) {
        const dayElement = createDatePickerDay(prevMonthLastDay - startingDay + i + 1, true);
        datePickerGrid.appendChild(dayElement);
    }
    
    // Current month days
    const today = new Date();
    for (let i = 1; i <= daysInMonth; i++) {
        const dayElement = createDatePickerDay(i, false);
        
        // Check if this day is today
        if (today.getDate() === i && 
            today.getMonth() === month && 
            today.getFullYear() === year) {
            dayElement.classList.add('today');
        }
        
        // Check if this day is selected
        if (currentDate.getDate() === i && 
            currentDate.getMonth() === month && 
            currentDate.getFullYear() === year) {
            dayElement.classList.add('selected');
        }
        
        datePickerGrid.appendChild(dayElement);
    }
    
    // Next month days
    const totalCells = 42;
    const remainingCells = totalCells - (startingDay + daysInMonth);
    for (let i = 1; i <= remainingCells; i++) {
        const dayElement = createDatePickerDay(i, true);
        datePickerGrid.appendChild(dayElement);
    }
}

function createDatePickerDay(dayNumber, isOtherMonth) {
    const dayElement = document.createElement('div');
    dayElement.className = 'date-picker-day';
    dayElement.textContent = dayNumber;
    
    if (isOtherMonth) {
        dayElement.classList.add('other-month');
    }
    
    dayElement.addEventListener('click', () => {
        if (!isOtherMonth) {
            currentDate = new Date(datePickerCurrentDate);
            currentDate.setDate(dayNumber);
            renderCalendar(currentDate);
        }
        datePicker.classList.remove('show');
    });
    
    return dayElement;
}

// Setup event listeners
function setupEventListeners() {
    // Month navigation
    prevMonthBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar(currentDate);
    });
    
    nextMonthBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar(currentDate);
    });
    
    // Date picker functionality
    monthDropdownTrigger.addEventListener('click', (e) => {
        datePickerCurrentDate = new Date(currentDate);
        datePicker.classList.toggle('show');
        renderDatePicker();
    });
    
    // Date picker navigation
    datePrevMonth.addEventListener('click', () => {
        datePickerCurrentDate.setMonth(datePickerCurrentDate.getMonth() - 1);
        renderDatePicker();
    });
    
    dateNextMonth.addEventListener('click', () => {
        datePickerCurrentDate.setMonth(datePickerCurrentDate.getMonth() + 1);
        renderDatePicker();
    });
    
    // Today button
    datePickerToday.addEventListener('click', () => {
        currentDate = new Date();
        renderCalendar(currentDate);
        datePicker.classList.remove('show');
    });
    
    // Close button
    datePickerClose.addEventListener('click', () => {
        datePicker.classList.remove('show');
    });
    
    // Close date picker when clicking outside
    document.addEventListener('click', (e) => {
        if (!monthDropdownTrigger.contains(e.target) && !datePicker.contains(e.target)) {
            datePicker.classList.remove('show');
        }
    });
    
    // Modal controls
    addEventBtn.addEventListener('click', () => {
        // Set today's date as default
        const today = new Date();
        const formattedDate = today.toISOString().split('T')[0];
        document.getElementById('eventDate').value = formattedDate;
        
        eventModal.style.display = 'flex';
        setTimeout(() => {
            eventModal.classList.add('show');
        }, 10);
    });
    
    importAIBtn.addEventListener('click', () => {
        importModal.style.display = 'flex';
        setTimeout(() => {
            importModal.classList.add('show');
        }, 10);
    });
    
    closeModalBtn.addEventListener('click', () => {
        eventModal.classList.remove('show');
        setTimeout(() => {
            eventModal.style.display = 'none';
        }, 300);
    });
    
    closeImportModalBtn.addEventListener('click', () => {
        importModal.classList.remove('show');
        setTimeout(() => {
            importModal.style.display = 'none';
        }, 300);
    });
    
    closeEventDetails.addEventListener('click', () => {
        eventDetailsModal.classList.remove('show');
        setTimeout(() => {
            eventDetailsModal.style.display = 'none';
        }, 300);
    });
    
    closeEventDetailsBtn.addEventListener('click', () => {
        eventDetailsModal.classList.remove('show');
        setTimeout(() => {
            eventDetailsModal.style.display = 'none';
        }, 300);
    });
    
    closeEditModal.addEventListener('click', () => {
        editEventModal.classList.remove('show');
        setTimeout(() => {
            editEventModal.style.display = 'none';
        }, 300);
    });
    
    cancelEventBtn.addEventListener('click', () => {
        eventModal.classList.remove('show');
        setTimeout(() => {
            eventModal.style.display = 'none';
        }, 300);
    });
    
    cancelImportBtn.addEventListener('click', () => {
        importModal.classList.remove('show');
        setTimeout(() => {
            importModal.style.display = 'none';
        }, 300);
    });
    
    cancelEdit.addEventListener('click', () => {
        editEventModal.classList.remove('show');
        setTimeout(() => {
            editEventModal.style.display = 'none';
        }, 300);
    });
    
    // Delete event button
    deleteEventBtn.addEventListener('click', () => {
        const eventIndex = parseInt(deleteEventBtn.dataset.eventIndex);
        if (!isNaN(eventIndex)) {
            deleteEvent(eventIndex);
        }
    });
    
    // Edit event button
    editEventBtn.addEventListener('click', () => {
        if (currentEditingEventId !== null) {
            editEvent(currentEditingEventId);
        }
    });
    
    processImportBtn.addEventListener('click', () => {
        const aiInput = document.getElementById('aiInput').value;
        if (aiInput.trim() === '') {
            alert('Please describe the events you want to import.');
            return;
        }
        
        // Simulate AI processing
        alert('AI is processing your events... This would connect to an AI service in a real application.');
        importModal.classList.remove('show');
        setTimeout(() => {
            importModal.style.display = 'none';
        }, 300);
    });
    
    // Form submission
    eventForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const title = document.getElementById('eventTitle').value;
        const date = document.getElementById('eventDate').value;
        const time = document.getElementById('eventTime').value;
        const description = document.getElementById('eventDescription').value;
        const category = document.getElementById('eventCategory').value;
        
        // Add event to events array
        events.push({
            title,
            date,
            time,
            description,
            category
        });
        
        // Re-render events
        renderEvents();
        
        // Reset form and close modal
        eventForm.reset();
        eventModal.classList.remove('show');
        setTimeout(() => {
            eventModal.style.display = 'none';
        }, 300);
        
        alert('Event added successfully!');
    });
    
    // Edit form submission
    editEventForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (currentEditingEventId !== null) {
            updateEvent(currentEditingEventId);
        }
    });
    
    // Close modals when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === eventModal) {
            eventModal.classList.remove('show');
            setTimeout(() => {
                eventModal.style.display = 'none';
            }, 300);
        }
        if (e.target === importModal) {
            importModal.classList.remove('show');
            setTimeout(() => {
                importModal.style.display = 'none';
            }, 300);
        }
        if (e.target === eventDetailsModal) {
            eventDetailsModal.classList.remove('show');
            setTimeout(() => {
                eventDetailsModal.style.display = 'none';
            }, 300);
        }
        if (e.target === editEventModal) {
            editEventModal.classList.remove('show');
            setTimeout(() => {
                editEventModal.style.display = 'none';
            }, 300);
        }
    });
}

// Upcoming Events Panel Collapse Functionality
document.addEventListener('DOMContentLoaded', function() {
    const collapseBtn = document.getElementById('collapseEvents');
    const eventsContent = document.getElementById('upcomingEventsContent');
    const collapseIcon = collapseBtn.querySelector('i');
    
    if (collapseBtn && eventsContent) {
        collapseBtn.addEventListener('click', function() {
            eventsContent.classList.toggle('collapsed');
            
            if (eventsContent.classList.contains('collapsed')) {
                collapseIcon.className = 'fas fa-chevron-up';
            } else {
                collapseIcon.className = 'fas fa-chevron-down';
            }
        });
    }
    
    // View Controls (purely aesthetic)
    const viewOptions = document.querySelectorAll('.view-option');
    viewOptions.forEach(option => {
        option.addEventListener('click', function() {
            viewOptions.forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');
        });
    });
});

// Initialize the calendar when page loads
document.addEventListener('DOMContentLoaded', initCalendar);