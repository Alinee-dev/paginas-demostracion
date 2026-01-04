// ============================================
// PAGE RENDERING FUNCTIONS
// ============================================

// DASHBOARD PAGE
function renderDashboardPage() {
    return `
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-icon stat-icon-primary">
                    <svg viewBox="0 0 24 24" fill="none"><path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" stroke-width="2"/><path d="M2 17L12 22L22 17" stroke="currentColor" stroke-width="2"/><path d="M2 12L12 17L22 12" stroke="currentColor" stroke-width="2"/></svg>
                </div>
                <div class="stat-content">
                    <div class="stat-label">Ingresos Totales</div>
                    <div class="stat-value" data-target="45280">$0</div>
                    <div class="stat-change positive"><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 12V4M8 4L4 8M8 4L12 8" stroke="currentColor" stroke-width="2"/></svg><span>+12.5%</span></div>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon stat-icon-success">
                    <svg viewBox="0 0 24 24" fill="none"><circle cx="9" cy="7" r="4" stroke="currentColor" stroke-width="2"/><path d="M2 21C2 17.134 5.134 14 9 14C12.866 14 16 17.134 16 21" stroke="currentColor" stroke-width="2"/></svg>
                </div>
                <div class="stat-content">
                    <div class="stat-label">Usuarios Activos</div>
                    <div class="stat-value" data-target="2847">0</div>
                    <div class="stat-change positive"><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 12V4M8 4L4 8M8 4L12 8" stroke="currentColor" stroke-width="2"/></svg><span>+8.2%</span></div>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon stat-icon-warning">
                    <svg viewBox="0 0 24 24" fill="none"><path d="M3 3H5L5.4 5M7 13H17L21 5H5.4M7 13L5.4 5M7 13L4.70711 15.2929C4.07714 15.9229 4.52331 17 5.41421 17H17" stroke="currentColor" stroke-width="2"/></svg>
                </div>
                <div class="stat-content">
                    <div class="stat-label">Pedidos</div>
                    <div class="stat-value" data-target="1523">0</div>
                    <div class="stat-change positive"><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 12V4M8 4L4 8M8 4L12 8" stroke="currentColor" stroke-width="2"/></svg><span>+5.7%</span></div>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon stat-icon-danger">
                    <svg viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" stroke-width="2"/><path d="M3 9H21M9 3V21" stroke="currentColor" stroke-width="2"/></svg>
                </div>
                <div class="stat-content">
                    <div class="stat-label">Productos</div>
                    <div class="stat-value" data-target="342">0</div>
                    <div class="stat-change negative"><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 4V12M8 12L4 8M8 12L12 8" stroke="currentColor" stroke-width="2"/></svg><span>-2.1%</span></div>
                </div>
            </div>
        </div>

        <div class="charts-grid">
            <div class="chart-card">
                <div class="card-header">
                    <h3>Ventas Mensuales</h3>
                    <select class="chart-filter"><option>Últimos 6 meses</option></select>
                </div>
                <div class="chart-container"><canvas id="salesChart"></canvas></div>
            </div>
            <div class="chart-card">
                <div class="card-header"><h3>Distribución de Categorías</h3></div>
                <div class="chart-container"><canvas id="categoryChart"></canvas></div>
            </div>
        </div>

        <div class="bottom-grid">
            <div class="table-card">
                <div class="card-header">
                    <h3>Pedidos Recientes</h3>
                    <button class="btn-secondary" onclick="loadPage('orders')">Ver todos</button>
                </div>
                <div class="table-container">
                    <table class="data-table">
                        <thead><tr><th>ID</th><th>Cliente</th><th>Producto</th><th>Monto</th><th>Estado</th><th>Fecha</th></tr></thead>
                        <tbody>${appState.orders.slice(0, 5).map(order => `<tr><td><strong>${order.id}</strong></td><td>${order.customer}</td><td>${order.product}</td><td><strong>$${order.amount.toLocaleString('es-ES')}</strong></td><td><span class="status-badge status-${order.status}">${getStatusText(order.status)}</span></td><td>${formatDate(order.date)}</td></tr>`).join('')}</tbody>
                    </table>
                </div>
            </div>
            <div class="activity-card">
                <div class="card-header"><h3>Actividad Reciente</h3></div>
                <div class="activity-list">${appState.activities.map(activity => `<div class="activity-item"><div class="activity-icon icon-${activity.type}">${activity.icon}</div><div class="activity-content"><div class="activity-title">${activity.title}</div><div class="activity-description">${activity.description}</div><div class="activity-time">${activity.time}</div></div></div>`).join('')}</div>
            </div>
        </div>
    `;
}

function initializeDashboardCharts() {
    const salesCtx = document.getElementById('salesChart');
    if (salesCtx) {
        appState.charts.sales = new Chart(salesCtx, {
            type: 'line',
            data: {
                labels: ['Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre', 'Enero'],
                datasets: [{
                    label: 'Ventas',
                    data: [32000, 38000, 35000, 42000, 39000, 45280],
                    borderColor: '#667eea',
                    backgroundColor: 'rgba(102, 126, 234, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } }
            }
        });
    }

    const categoryCtx = document.getElementById('categoryChart');
    if (categoryCtx) {
        appState.charts.category = new Chart(categoryCtx, {
            type: 'doughnut',
            data: {
                labels: ['Electrónica', 'Accesorios', 'Software', 'Servicios', 'Otros'],
                datasets: [{
                    data: [35, 25, 20, 15, 5],
                    backgroundColor: ['#667eea', '#0ea5e9', '#f59e0b', '#f5576c', '#94a3b8']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: 'bottom' } }
            }
        });
    }
}

function animateStatCards() {
    document.querySelectorAll('.stat-value').forEach(stat => {
        const target = parseInt(stat.dataset.target);
        let current = 0;
        const increment = target / 100;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                stat.textContent = stat.parentElement.querySelector('.stat-label').textContent.includes('Ingresos') ? '$' + target.toLocaleString('es-ES') : target.toLocaleString('es-ES');
                clearInterval(timer);
            } else {
                stat.textContent = stat.parentElement.querySelector('.stat-label').textContent.includes('Ingresos') ? '$' + Math.floor(current).toLocaleString('es-ES') : Math.floor(current).toLocaleString('es-ES');
            }
        }, 20);
    });
}

// ANALYTICS PAGE
function renderAnalyticsPage() {
    return `
        <div class="page-section">
            <h2>📊 Análisis de Rendimiento</h2>
            <p>Métricas detalladas y tendencias de tu negocio</p>
            
            <div class="stats-grid" style="margin-top: 2rem;">
                <div class="stat-card">
                    <div class="stat-icon stat-icon-primary">
                        <svg viewBox="0 0 24 24" fill="none"><path d="M3 3V21H21" stroke="currentColor" stroke-width="2"/><path d="M7 14L11 10L15 14L21 8" stroke="currentColor" stroke-width="2"/></svg>
                    </div>
                    <div class="stat-content">
                        <div class="stat-label">Crecimiento Mensual</div>
                        <div class="stat-value">+18.5%</div>
                        <div class="stat-change positive"><span>Comparado con el mes anterior</span></div>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon stat-icon-success">
                        <svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/><path d="M8 12L11 15L16 9" stroke="currentColor" stroke-width="2"/></svg>
                    </div>
                    <div class="stat-content">
                        <div class="stat-label">Tasa de Conversión</div>
                        <div class="stat-value">3.8%</div>
                        <div class="stat-change positive"><span>+0.5% este mes</span></div>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon stat-icon-warning">
                        <svg viewBox="0 0 24 24" fill="none"><path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" stroke-width="2"/></svg>
                    </div>
                    <div class="stat-content">
                        <div class="stat-label">Valor Promedio</div>
                        <div class="stat-value">$287</div>
                        <div class="stat-change positive"><span>Por pedido</span></div>
                    </div>
                </div>
            </div>

            <div class="table-card" style="margin-top: 2rem;">
                <div class="card-header">
                    <h3>Productos Más Vendidos</h3>
                </div>
                <table class="data-table">
                    <thead><tr><th>Producto</th><th>Categoría</th><th>Ventas</th><th>Ingresos</th></tr></thead>
                    <tbody>
                        <tr><td><strong>Laptop Pro 15"</strong></td><td>Electrónica</td><td>145 unidades</td><td><strong>$188,355</strong></td></tr>
                        <tr><td><strong>Monitor 27"</strong></td><td>Electrónica</td><td>98 unidades</td><td><strong>$39,102</strong></td></tr>
                        <tr><td><strong>Auriculares Pro</strong></td><td>Accesorios</td><td>87 unidades</td><td><strong>$17,313</strong></td></tr>
                        <tr><td><strong>Teclado Mecánico</strong></td><td>Accesorios</td><td>76 unidades</td><td><strong>$9,804</strong></td></tr>
                        <tr><td><strong>Mouse Inalámbrico</strong></td><td>Accesorios</td><td>65 unidades</td><td><strong>$2,925</strong></td></tr>
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

function initializeAnalyticsCharts() {
    // Analytics charts would go here
}

// USERS PAGE
function renderUsersPage() {
    return `
        <div class="page-section">
            <h2>👥 Gestión de Usuarios</h2>
            <p>Administra los usuarios de la plataforma</p>
            
            <div class="stats-grid" style="margin: 2rem 0;">
                <div class="stat-card">
                    <div class="stat-icon stat-icon-success">
                        <svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/><path d="M8 12L11 15L16 9" stroke="currentColor" stroke-width="2"/></svg>
                    </div>
                    <div class="stat-content">
                        <div class="stat-label">Usuarios Activos</div>
                        <div class="stat-value">${appState.users.filter(u => u.status === 'active').length}</div>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon stat-icon-danger">
                        <svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/><path d="M15 9L9 15M9 9L15 15" stroke="currentColor" stroke-width="2"/></svg>
                    </div>
                    <div class="stat-content">
                        <div class="stat-label">Usuarios Inactivos</div>
                        <div class="stat-value">${appState.users.filter(u => u.status === 'inactive').length}</div>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon stat-icon-primary">
                        <svg viewBox="0 0 24 24" fill="none"><path d="M12 4V20M4 12H20" stroke="currentColor" stroke-width="2"/></svg>
                    </div>
                    <div class="stat-content">
                        <div class="stat-label">Total Usuarios</div>
                        <div class="stat-value">${appState.users.length}</div>
                    </div>
                </div>
            </div>

            <div class="table-card">
                <div class="card-header">
                    <h3>Lista de Usuarios</h3>
                </div>
                <table class="data-table">
                    <thead><tr><th>Nombre</th><th>Email</th><th>Rol</th><th>Estado</th><th>Registro</th></tr></thead>
                    <tbody>${appState.users.map(user => `
                        <tr>
                            <td><strong>${user.name}</strong></td>
                            <td>${user.email}</td>
                            <td>${user.role}</td>
                            <td><span class="status-badge status-${user.status === 'active' ? 'completed' : 'cancelled'}">${user.status === 'active' ? 'Activo' : 'Inactivo'}</span></td>
                            <td>${formatDate(user.joined)}</td>
                        </tr>
                    `).join('')}</tbody>
                </table>
            </div>
        </div>
    `;
}

// PRODUCTS PAGE
function renderProductsPage() {
    return `
        <div class="page-section">
            <h2>📦 Gestión de Productos</h2>
            <p>Administra tu catálogo de productos</p>
            
            <div class="stats-grid" style="margin: 2rem 0;">
                <div class="stat-card">
                    <div class="stat-icon stat-icon-primary">
                        <svg viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" stroke-width="2"/></svg>
                    </div>
                    <div class="stat-content">
                        <div class="stat-label">Total Productos</div>
                        <div class="stat-value">${appState.products.length}</div>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon stat-icon-success">
                        <svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/><path d="M8 12L11 15L16 9" stroke="currentColor" stroke-width="2"/></svg>
                    </div>
                    <div class="stat-content">
                        <div class="stat-label">Productos Activos</div>
                        <div class="stat-value">${appState.products.filter(p => p.status === 'active').length}</div>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon stat-icon-warning">
                        <svg viewBox="0 0 24 24" fill="none"><path d="M12 9V13M12 17H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" stroke-width="2"/></svg>
                    </div>
                    <div class="stat-content">
                        <div class="stat-label">Stock Bajo</div>
                        <div class="stat-value">${appState.products.filter(p => p.stock < 10).length}</div>
                    </div>
                </div>
            </div>

            <div class="table-card">
                <div class="card-header">
                    <h3>Catálogo de Productos</h3>
                </div>
                <table class="data-table">
                    <thead><tr><th>Nombre</th><th>Categoría</th><th>Precio</th><th>Stock</th><th>Estado</th></tr></thead>
                    <tbody>${appState.products.map(product => `
                        <tr>
                            <td><strong>${product.name}</strong></td>
                            <td>${product.category}</td>
                            <td><strong>$${product.price.toLocaleString('es-ES')}</strong></td>
                            <td><span style="color: ${product.stock < 10 ? '#f59e0b' : 'inherit'}">${product.stock} unidades</span></td>
                            <td><span class="status-badge status-${product.status === 'active' ? 'completed' : 'cancelled'}">${product.status === 'active' ? 'Activo' : 'Inactivo'}</span></td>
                        </tr>
                    `).join('')}</tbody>
                </table>
            </div>
        </div>
    `;
}

// ORDERS PAGE
function renderOrdersPage() {
    return `
        <div class="page-section">
            <h2>🛒 Gestión de Pedidos</h2>
            <p>Administra todos los pedidos de la plataforma</p>
            
            <div class="stats-grid" style="margin: 2rem 0;">
                <div class="stat-card">
                    <div class="stat-icon stat-icon-primary">
                        <svg viewBox="0 0 24 24" fill="none"><path d="M9 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V7C19 5.89543 18.1046 5 17 5H15M9 5C9 6.10457 9.89543 7 11 7H13C14.1046 7 15 6.10457 15 5M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5" stroke="currentColor" stroke-width="2"/></svg>
                    </div>
                    <div class="stat-content">
                        <div class="stat-label">Total Pedidos</div>
                        <div class="stat-value">${appState.orders.length}</div>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon stat-icon-warning">
                        <svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/><path d="M12 6V12L16 14" stroke="currentColor" stroke-width="2"/></svg>
                    </div>
                    <div class="stat-content">
                        <div class="stat-label">Pendientes</div>
                        <div class="stat-value">${appState.orders.filter(o => o.status === 'pending').length}</div>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon stat-icon-success">
                        <svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/><path d="M8 12L11 15L16 9" stroke="currentColor" stroke-width="2"/></svg>
                    </div>
                    <div class="stat-content">
                        <div class="stat-label">Completados</div>
                        <div class="stat-value">${appState.orders.filter(o => o.status === 'completed').length}</div>
                    </div>
                </div>
            </div>

            <div class="table-card">
                <div class="card-header">
                    <h3>Todos los Pedidos</h3>
                </div>
                <table class="data-table">
                    <thead><tr><th>ID</th><th>Cliente</th><th>Producto</th><th>Monto</th><th>Estado</th><th>Fecha</th></tr></thead>
                    <tbody>${appState.orders.map(order => `
                        <tr>
                            <td><strong>${order.id}</strong></td>
                            <td>${order.customer}</td>
                            <td>${order.product}</td>
                            <td><strong>$${order.amount.toLocaleString('es-ES')}</strong></td>
                            <td><span class="status-badge status-${order.status}">${getStatusText(order.status)}</span></td>
                            <td>${formatDate(order.date)}</td>
                        </tr>
                    `).join('')}</tbody>
                </table>
            </div>
        </div>
    `;
}

// SETTINGS PAGE
function renderSettingsPage() {
    return `
        <div class="page-section">
            <h2>⚙️ Configuración</h2>
            <p>Personaliza tu experiencia en el dashboard</p>
            
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; margin-top: 2rem;">
                <div style="background: var(--bg-tertiary); padding: 1.5rem; border-radius: var(--radius-md);">
                    <h3 style="margin-bottom: 1rem; color: var(--text-primary);">👤 Perfil de Usuario</h3>
                    <div style="margin-bottom: 1rem;">
                        <label style="display: block; margin-bottom: 0.5rem; color: var(--text-secondary); font-size: 0.9rem;">Nombre Completo</label>
                        <input type="text" value="Admin User" style="width: 100%; padding: 0.75rem; border: 1px solid var(--border-light); border-radius: var(--radius-sm); background: var(--bg-secondary);">
                    </div>
                    <div style="margin-bottom: 1rem;">
                        <label style="display: block; margin-bottom: 0.5rem; color: var(--text-secondary); font-size: 0.9rem;">Email</label>
                        <input type="email" value="admin@example.com" style="width: 100%; padding: 0.75rem; border: 1px solid var(--border-light); border-radius: var(--radius-sm); background: var(--bg-secondary);">
                    </div>
                    <button style="background: var(--primary-gradient); color: white; border: none; padding: 0.75rem 1.5rem; border-radius: var(--radius-sm); cursor: pointer; font-weight: 600;">Guardar Cambios</button>
                </div>

                <div style="background: var(--bg-tertiary); padding: 1.5rem; border-radius: var(--radius-md);">
                    <h3 style="margin-bottom: 1rem; color: var(--text-primary);">🔔 Notificaciones</h3>
                    <div style="margin-bottom: 1rem; display: flex; justify-content: space-between; align-items: center;">
                        <div>
                            <strong style="display: block; color: var(--text-primary);">Notificaciones por Email</strong>
                            <span style="font-size: 0.85rem; color: var(--text-secondary);">Recibe actualizaciones por correo</span>
                        </div>
                        <input type="checkbox" checked style="width: 20px; height: 20px;">
                    </div>
                    <div style="margin-bottom: 1rem; display: flex; justify-content: space-between; align-items: center;">
                        <div>
                            <strong style="display: block; color: var(--text-primary);">Alertas de Pedidos</strong>
                            <span style="font-size: 0.85rem; color: var(--text-secondary);">Notificaciones de nuevos pedidos</span>
                        </div>
                        <input type="checkbox" checked style="width: 20px; height: 20px;">
                    </div>
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <div>
                            <strong style="display: block; color: var(--text-primary);">Reportes Semanales</strong>
                            <span style="font-size: 0.85rem; color: var(--text-secondary);">Resumen semanal de actividad</span>
                        </div>
                        <input type="checkbox" style="width: 20px; height: 20px;">
                    </div>
                </div>

                <div style="background: var(--bg-tertiary); padding: 1.5rem; border-radius: var(--radius-md);">
                    <h3 style="margin-bottom: 1rem; color: var(--text-primary);">🌐 Preferencias</h3>
                    <div style="margin-bottom: 1rem;">
                        <label style="display: block; margin-bottom: 0.5rem; color: var(--text-secondary); font-size: 0.9rem;">Idioma</label>
                        <select style="width: 100%; padding: 0.75rem; border: 1px solid var(--border-light); border-radius: var(--radius-sm); background: var(--bg-secondary);">
                            <option>Español</option>
                            <option>English</option>
                            <option>Português</option>
                        </select>
                    </div>
                    <div>
                        <label style="display: block; margin-bottom: 0.5rem; color: var(--text-secondary); font-size: 0.9rem;">Zona Horaria</label>
                        <select style="width: 100%; padding: 0.75rem; border: 1px solid var(--border-light); border-radius: var(--radius-sm); background: var(--bg-secondary);">
                            <option>GMT-3 (Buenos Aires)</option>
                            <option>GMT-5 (New York)</option>
                            <option>GMT+0 (London)</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
    `;
}
