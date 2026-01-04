// ============================================
// DASHBOARD SPA - Complete Application
// ============================================

// Global State
const appState = {
    currentPage: 'dashboard',
    sidebarCollapsed: false,
    charts: {},
    users: [
        { id: 1, name: 'María González', email: 'maria@example.com', role: 'Admin', status: 'active', avatar: 'MG', joined: '2025-01-15' },
        { id: 2, name: 'Carlos Rodríguez', email: 'carlos@example.com', role: 'Usuario', status: 'active', avatar: 'CR', joined: '2025-02-20' },
        { id: 3, name: 'Ana Martínez', email: 'ana@example.com', role: 'Editor', status: 'active', avatar: 'AM', joined: '2025-03-10' },
        { id: 4, name: 'Luis Fernández', email: 'luis@example.com', role: 'Usuario', status: 'inactive', avatar: 'LF', joined: '2025-04-05' },
        { id: 5, name: 'Sofia López', email: 'sofia@example.com', role: 'Admin', status: 'active', avatar: 'SL', joined: '2025-05-12' },
    ],
    products: [
        { id: 1, name: 'Laptop Pro 15"', category: 'Electrónica', price: 1299, stock: 45, status: 'active' },
        { id: 2, name: 'Mouse Inalámbrico', category: 'Accesorios', price: 45, stock: 5, status: 'active' },
        { id: 3, name: 'Teclado Mecánico', category: 'Accesorios', price: 129, stock: 23, status: 'active' },
        { id: 4, name: 'Monitor 27"', category: 'Electrónica', price: 399, stock: 12, status: 'active' },
        { id: 5, name: 'Auriculares Pro', category: 'Accesorios', price: 199, stock: 34, status: 'active' },
        { id: 6, name: 'Webcam HD', category: 'Electrónica', price: 89, stock: 0, status: 'inactive' },
        { id: 7, name: 'SSD 1TB', category: 'Electrónica', price: 149, stock: 56, status: 'active' },
    ],
    orders: [
        { id: '#ORD-001', customer: 'María González', product: 'Laptop Pro 15"', amount: 1299, status: 'completed', date: '2026-01-04' },
        { id: '#ORD-002', customer: 'Carlos Rodríguez', product: 'Mouse Inalámbrico', amount: 45, status: 'pending', date: '2026-01-04' },
        { id: '#ORD-003', customer: 'Ana Martínez', product: 'Teclado Mecánico', amount: 129, status: 'processing', date: '2026-01-03' },
        { id: '#ORD-004', customer: 'Luis Fernández', product: 'Monitor 27"', amount: 399, status: 'completed', date: '2026-01-03' },
        { id: '#ORD-005', customer: 'Sofia López', product: 'Auriculares Pro', amount: 199, status: 'completed', date: '2026-01-02' },
        { id: '#ORD-006', customer: 'Diego Torres', product: 'Webcam HD', amount: 89, status: 'cancelled', date: '2026-01-02' },
        { id: '#ORD-007', customer: 'Laura Pérez', product: 'SSD 1TB', amount: 149, status: 'processing', date: '2026-01-01' },
    ],
    activities: [
        { icon: '✅', type: 'success', title: 'Nuevo pedido recibido', description: 'María González realizó un pedido de $1,299', time: 'Hace 5 minutos' },
        { icon: '👤', type: 'success', title: 'Nuevo usuario registrado', description: 'Carlos Rodríguez se unió a la plataforma', time: 'Hace 15 minutos' },
        { icon: '⚠️', type: 'warning', title: 'Stock bajo', description: 'Mouse Inalámbrico tiene solo 5 unidades', time: 'Hace 1 hora' },
        { icon: '📦', type: 'success', title: 'Pedido enviado', description: 'Pedido #ORD-004 fue enviado', time: 'Hace 2 horas' },
        { icon: '❌', type: 'danger', title: 'Pedido cancelado', description: 'Diego Torres canceló su pedido', time: 'Hace 3 horas' },
        { icon: '💰', type: 'success', title: 'Pago recibido', description: 'Pago de $399 procesado exitosamente', time: 'Hace 4 horas' },
    ]
};

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    initializeSidebar();
    initializeNavigation();
    loadPage('dashboard');
});

// ============================================
// SIDEBAR & NAVIGATION
// ============================================

function initializeSidebar() {
    const sidebarToggle = document.getElementById('sidebarToggle');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const sidebar = document.getElementById('sidebar');

    const toggleSidebar = () => {
        console.log('Toggle clicked! Current state:', sidebar.classList.contains('collapsed'));
        sidebar.classList.toggle('collapsed');
        appState.sidebarCollapsed = !appState.sidebarCollapsed;
        console.log('New state:', sidebar.classList.contains('collapsed'));
    };

    if (sidebarToggle && sidebar) {
        sidebarToggle.addEventListener('click', toggleSidebar);
    } else {
        console.error('Sidebar toggle or sidebar not found!');
    }

    if (mobileMenuBtn && sidebar) {
        mobileMenuBtn.addEventListener('click', () => {
            sidebar.classList.toggle('mobile-open');
        });
    }
}

function initializeNavigation() {
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const page = item.dataset.page;
            loadPage(page);

            // Update active state
            document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');

            // Close mobile menu
            if (window.innerWidth <= 768) {
                document.getElementById('sidebar')?.classList.remove('mobile-open');
            }
        });
    });
}

// ============================================
// PAGE LOADING SYSTEM
// ============================================

function loadPage(pageName) {
    appState.currentPage = pageName;
    const contentArea = document.querySelector('.content-area');
    const pageTitle = document.querySelector('.page-title');

    // Update title
    const titles = {
        dashboard: 'Dashboard',
        analytics: 'Analíticas',
        users: 'Usuarios',
        products: 'Productos',
        orders: 'Pedidos',
        settings: 'Configuración'
    };
    pageTitle.textContent = titles[pageName] || pageName;

    // Load page content
    const pages = {
        dashboard: renderDashboardPage,
        analytics: renderAnalyticsPage,
        users: renderUsersPage,
        products: renderProductsPage,
        orders: renderOrdersPage,
        settings: renderSettingsPage
    };

    const renderFunction = pages[pageName];
    if (renderFunction) {
        contentArea.innerHTML = renderFunction();
        initializePageScripts(pageName);
    }
}

function initializePageScripts(pageName) {
    // Destroy existing charts
    Object.values(appState.charts).forEach(chart => {
        if (chart && chart.destroy) chart.destroy();
    });
    appState.charts = {};

    if (pageName === 'dashboard') {
        initializeDashboardCharts();
        animateStatCards();
    } else if (pageName === 'analytics') {
        initializeAnalyticsCharts();
    }
}

// Utility functions
function getStatusText(status) {
    const statusMap = {
        'completed': 'Completado',
        'pending': 'Pendiente',
        'processing': 'Procesando',
        'cancelled': 'Cancelado'
    };
    return statusMap[status] || status;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { day: '2-digit', month: 'short', year: 'numeric' };
    return date.toLocaleDateString('es-ES', options);
}

// Handle window resize
window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        document.getElementById('sidebar')?.classList.remove('mobile-open');
    }
});
