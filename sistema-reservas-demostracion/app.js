// Estado de la aplicación
let reservations = [];
let currentFilter = 'all';
let currentSort = 'date-desc';

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    loadReservations();
    initializeEventListeners();
    setMinDate();
    updateStats();
    renderReservations();
});

// Event Listeners
function initializeEventListeners() {
    // Form submission
    document.getElementById('reservationForm').addEventListener('submit', handleFormSubmit);
    
    // Search
    document.getElementById('searchInput').addEventListener('input', handleSearch);
    
    // Filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', handleFilterClick);
    });
    
    // Sort select
    document.getElementById('sortSelect').addEventListener('change', handleSortChange);
}

// Set minimum date to today
function setMinDate() {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('reservationDate').setAttribute('min', today);
}

// Handle form submission
function handleFormSubmit(e) {
    e.preventDefault();
    
    const formData = {
        id: Date.now(),
        clientName: document.getElementById('clientName').value.trim(),
        clientEmail: document.getElementById('clientEmail').value.trim(),
        clientPhone: document.getElementById('clientPhone').value.trim(),
        serviceType: document.getElementById('serviceType').value,
        reservationDate: document.getElementById('reservationDate').value,
        reservationTime: document.getElementById('reservationTime').value,
        numberOfPeople: parseInt(document.getElementById('numberOfPeople').value),
        duration: parseFloat(document.getElementById('duration').value),
        specialRequests: document.getElementById('specialRequests').value.trim(),
        status: 'pending',
        createdAt: new Date().toISOString()
    };
    
    reservations.push(formData);
    saveReservations();
    updateStats();
    renderReservations();
    
    // Reset form
    e.target.reset();
    
    // Show success toast
    showToast('Reserva creada exitosamente', 'success');
    
    // Scroll to reservations list
    setTimeout(() => {
        document.querySelector('.reservations-section').scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    }, 300);
}

// Handle search
function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase();
    renderReservations(searchTerm);
}

// Handle filter click
function handleFilterClick(e) {
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    e.target.classList.add('active');
    currentFilter = e.target.dataset.filter;
    renderReservations();
}

// Handle sort change
function handleSortChange(e) {
    currentSort = e.target.value;
    renderReservations();
}

// Update statistics
function updateStats() {
    const total = reservations.length;
    const active = reservations.filter(r => r.status === 'pending' || r.status === 'confirmed').length;
    const completed = reservations.filter(r => r.status === 'completed').length;
    
    document.getElementById('totalReservas').textContent = total;
    document.getElementById('reservasActivas').textContent = active;
    document.getElementById('reservasCompletadas').textContent = completed;
}

// Render reservations
function renderReservations(searchTerm = '') {
    const container = document.getElementById('reservationsList');
    
    // Filter reservations
    let filtered = reservations.filter(reservation => {
        // Apply status filter
        if (currentFilter !== 'all' && reservation.status !== currentFilter) {
            return false;
        }
        
        // Apply search filter
        if (searchTerm) {
            const searchFields = [
                reservation.clientName,
                reservation.clientEmail,
                reservation.serviceType,
                getServiceName(reservation.serviceType)
            ].join(' ').toLowerCase();
            
            if (!searchFields.includes(searchTerm)) {
                return false;
            }
        }
        
        return true;
    });
    
    // Sort reservations
    filtered.sort((a, b) => {
        switch (currentSort) {
            case 'date-desc':
                return new Date(b.reservationDate + ' ' + b.reservationTime) - 
                       new Date(a.reservationDate + ' ' + a.reservationTime);
            case 'date-asc':
                return new Date(a.reservationDate + ' ' + a.reservationTime) - 
                       new Date(b.reservationDate + ' ' + b.reservationTime);
            case 'name-asc':
                return a.clientName.localeCompare(b.clientName);
            case 'name-desc':
                return b.clientName.localeCompare(a.clientName);
            default:
                return 0;
        }
    });
    
    // Update count
    const countText = filtered.length === 0 
        ? 'No hay reservas que coincidan' 
        : `${filtered.length} reserva${filtered.length !== 1 ? 's' : ''} encontrada${filtered.length !== 1 ? 's' : ''}`;
    document.getElementById('reservationCount').textContent = countText;
    
    // Render
    if (filtered.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">
                    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="8" y="12" width="48" height="44" rx="6" stroke="currentColor" stroke-width="3"/>
                        <path d="M8 24H56" stroke="currentColor" stroke-width="3"/>
                        <circle cx="22" cy="8" r="4" fill="currentColor"/>
                        <circle cx="42" cy="8" r="4" fill="currentColor"/>
                        <rect x="20" y="32" width="8" height="8" rx="2" fill="currentColor"/>
                        <rect x="36" y="32" width="8" height="8" rx="2" fill="currentColor"/>
                    </svg>
                </div>
                <h3>${searchTerm || currentFilter !== 'all' ? 'No se encontraron reservas' : 'No hay reservas aún'}</h3>
                <p>${searchTerm || currentFilter !== 'all' ? 'Intenta con otros filtros o términos de búsqueda' : 'Crea tu primera reserva usando el formulario de arriba'}</p>
            </div>
        `;
    } else {
        container.innerHTML = filtered.map(reservation => createReservationCard(reservation)).join('');
    }
}

// Create reservation card HTML
function createReservationCard(reservation) {
    const serviceName = getServiceName(reservation.serviceType);
    const formattedDate = formatDate(reservation.reservationDate);
    const formattedTime = formatTime(reservation.reservationTime);
    const statusClass = `status-${reservation.status}`;
    const statusText = getStatusText(reservation.status);
    
    return `
        <div class="reservation-card" data-id="${reservation.id}">
            <div class="reservation-header">
                <div class="reservation-client">
                    <div class="client-name">${reservation.clientName}</div>
                    <div class="client-contact">
                        <span>📧 ${reservation.clientEmail}</span>
                        <span>📱 ${reservation.clientPhone}</span>
                    </div>
                </div>
                <span class="status-badge ${statusClass}">${statusText}</span>
            </div>
            
            <div class="reservation-details">
                <div class="detail-item">
                    <svg class="detail-icon" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6 2V5M14 2V5M3 8H17M4 4H16C16.5523 4 17 4.44772 17 5V17C17 17.5523 16.5523 18 16 18H4C3.44772 18 3 17.5523 3 17V5C3 4.44772 3.44772 4 4 4Z" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                    <div>
                        <div class="detail-label">Fecha</div>
                        <div class="detail-value">${formattedDate}</div>
                    </div>
                </div>
                
                <div class="detail-item">
                    <svg class="detail-icon" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="10" cy="10" r="7" stroke="currentColor" stroke-width="2"/>
                        <path d="M10 5V10L13 13" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                    <div>
                        <div class="detail-label">Hora</div>
                        <div class="detail-value">${formattedTime}</div>
                    </div>
                </div>
                
                <div class="detail-item">
                    <svg class="detail-icon" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 12H11M9 8H11M6 16H14C15.1046 16 16 15.1046 16 14V6C16 4.89543 15.1046 4 14 4H6C4.89543 4 4 4.89543 4 6V14C4 15.1046 4.89543 16 6 16Z" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                    <div>
                        <div class="detail-label">Servicio</div>
                        <div class="detail-value">${serviceName}</div>
                    </div>
                </div>
                
                <div class="detail-item">
                    <svg class="detail-icon" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 4.35418C11.3604 4.12262 10.6688 4 9.94737 4C6.66069 4 4 6.68629 4 10C4 13.3137 6.66069 16 9.94737 16C13.234 16 15.8947 13.3137 15.8947 10V9M12 9C12 10.6569 10.6569 12 9 12C7.34315 12 6 10.6569 6 9C6 7.34315 7.34315 6 9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                    <div>
                        <div class="detail-label">Personas</div>
                        <div class="detail-value">${reservation.numberOfPeople}</div>
                    </div>
                </div>
                
                <div class="detail-item">
                    <svg class="detail-icon" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10 5V10L13 13" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                        <circle cx="10" cy="10" r="7" stroke="currentColor" stroke-width="2"/>
                    </svg>
                    <div>
                        <div class="detail-label">Duración</div>
                        <div class="detail-value">${reservation.duration}h</div>
                    </div>
                </div>
            </div>
            
            ${reservation.specialRequests ? `
                <div class="special-requests">
                    <div class="special-requests-label">Solicitudes Especiales:</div>
                    <div class="special-requests-text">${reservation.specialRequests}</div>
                </div>
            ` : ''}
            
            <div class="reservation-actions">
                ${reservation.status === 'pending' ? `
                    <button class="action-btn btn-confirm" onclick="updateStatus(${reservation.id}, 'confirmed')">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M3 8L6 11L13 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        Confirmar
                    </button>
                ` : ''}
                
                ${reservation.status === 'confirmed' ? `
                    <button class="action-btn btn-complete" onclick="updateStatus(${reservation.id}, 'completed')">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M3 8L6 11L13 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        Completar
                    </button>
                ` : ''}
                
                ${reservation.status !== 'cancelled' && reservation.status !== 'completed' ? `
                    <button class="action-btn btn-cancel" onclick="updateStatus(${reservation.id}, 'cancelled')">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M4 4L12 12M12 4L4 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                        </svg>
                        Cancelar
                    </button>
                ` : ''}
                
                <button class="action-btn btn-delete" onclick="deleteReservation(${reservation.id})">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3 4H13M5 4V3C5 2.44772 5.44772 2 6 2H10C10.5523 2 11 2.44772 11 3V4M6 7V11M10 7V11M4 4H12V13C12 13.5523 11.5523 14 11 14H5C4.44772 14 4 13.5523 4 13V4Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                    </svg>
                    Eliminar
                </button>
            </div>
        </div>
    `;
}

// Update reservation status
function updateStatus(id, newStatus) {
    const reservation = reservations.find(r => r.id === id);
    if (reservation) {
        reservation.status = newStatus;
        saveReservations();
        updateStats();
        renderReservations();
        
        const statusMessages = {
            confirmed: 'Reserva confirmada',
            completed: 'Reserva completada',
            cancelled: 'Reserva cancelada'
        };
        
        showToast(statusMessages[newStatus], 'success');
    }
}

// Delete reservation
function deleteReservation(id) {
    if (confirm('¿Estás seguro de que deseas eliminar esta reserva?')) {
        reservations = reservations.filter(r => r.id !== id);
        saveReservations();
        updateStats();
        renderReservations();
        showToast('Reserva eliminada', 'info');
    }
}

// Helper functions
function getServiceName(serviceType) {
    const services = {
        restaurant: 'Restaurante',
        hotel: 'Hotel',
        spa: 'Spa & Wellness',
        salon: 'Salón de Eventos',
        tour: 'Tour Guiado',
        consulta: 'Consulta Profesional'
    };
    return services[serviceType] || serviceType;
}

function getStatusText(status) {
    const statuses = {
        pending: 'Pendiente',
        confirmed: 'Confirmada',
        completed: 'Completada',
        cancelled: 'Cancelada'
    };
    return statuses[status] || status;
}

function formatDate(dateString) {
    const date = new Date(dateString + 'T00:00:00');
    const options = { 
        weekday: 'short', 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    };
    return date.toLocaleDateString('es-ES', options);
}

function formatTime(timeString) {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
}

// Toast notification
function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    const toastMessage = toast.querySelector('.toast-message');
    
    toastMessage.textContent = message;
    toast.className = `toast ${type}`;
    
    // Show toast
    setTimeout(() => toast.classList.add('show'), 100);
    
    // Hide toast after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Local storage functions
function saveReservations() {
    localStorage.setItem('reservations', JSON.stringify(reservations));
}

function loadReservations() {
    const stored = localStorage.getItem('reservations');
    if (stored) {
        reservations = JSON.parse(stored);
    }
}

// Demo data (optional - uncomment to add sample data)
/*
function addDemoData() {
    if (reservations.length === 0) {
        const demoReservations = [
            {
                id: Date.now() - 1000000,
                clientName: 'María González',
                clientEmail: 'maria.gonzalez@email.com',
                clientPhone: '+54 11 2345-6789',
                serviceType: 'restaurant',
                reservationDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
                reservationTime: '20:00',
                numberOfPeople: 4,
                duration: 2,
                specialRequests: 'Mesa junto a la ventana, celebración de cumpleaños',
                status: 'confirmed',
                createdAt: new Date(Date.now() - 1000000).toISOString()
            },
            {
                id: Date.now() - 2000000,
                clientName: 'Carlos Rodríguez',
                clientEmail: 'carlos.r@email.com',
                clientPhone: '+54 11 3456-7890',
                serviceType: 'spa',
                reservationDate: new Date(Date.now() + 172800000).toISOString().split('T')[0],
                reservationTime: '15:30',
                numberOfPeople: 2,
                duration: 3,
                specialRequests: 'Masaje de piedras calientes',
                status: 'pending',
                createdAt: new Date(Date.now() - 2000000).toISOString()
            }
        ];
        
        reservations = demoReservations;
        saveReservations();
        updateStats();
        renderReservations();
    }
}

// Uncomment to load demo data on first visit
// addDemoData();
*/
