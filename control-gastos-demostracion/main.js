// Financial Tracker Application - Income & Expense Management
class FinancialTracker {
    constructor() {
        this.transactions = this.loadTransactions();
        this.selectedCategory = null;
        this.transactionType = 'expense'; // 'income' or 'expense'
        this.currentFilter = 'all'; // 'all', 'income', or 'expense'
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setDefaultDate();
        this.renderTransactions();
        this.updateStats();
        this.updateBadges();
    }

    setupEventListeners() {
        // Form submission
        const form = document.getElementById('transaction-form');
        form.addEventListener('submit', (e) => this.handleSubmit(e));

        // Transaction type toggle
        const typeButtons = document.querySelectorAll('.type-btn');
        typeButtons.forEach(btn => {
            btn.addEventListener('click', () => this.switchTransactionType(btn));
        });

        // Category selection
        const categoryButtons = document.querySelectorAll('.category-btn');
        categoryButtons.forEach(btn => {
            btn.addEventListener('click', () => this.selectCategory(btn));
        });

        // Filter tabs
        const filterTabs = document.querySelectorAll('.filter-tab');
        filterTabs.forEach(tab => {
            tab.addEventListener('click', () => this.switchFilter(tab));
        });
    }

    setDefaultDate() {
        const dateInput = document.getElementById('date');
        const today = new Date().toISOString().split('T')[0];
        dateInput.value = today;
    }

    switchTransactionType(button) {
        // Remove active class from all type buttons
        document.querySelectorAll('.type-btn').forEach(btn => {
            btn.classList.remove('active');
        });

        // Add active class to selected button
        button.classList.add('active');
        this.transactionType = button.dataset.type;

        // Show/hide appropriate category grids
        const expenseCategories = document.getElementById('expense-categories');
        const incomeCategories = document.getElementById('income-categories');

        if (this.transactionType === 'income') {
            expenseCategories.style.display = 'none';
            incomeCategories.style.display = 'grid';
        } else {
            expenseCategories.style.display = 'grid';
            incomeCategories.style.display = 'none';
        }

        // Reset category selection
        this.selectedCategory = null;
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.classList.remove('active');
        });
    }

    selectCategory(button) {
        // Remove active class from all buttons in current category grid
        const parentGrid = button.parentElement;
        parentGrid.querySelectorAll('.category-btn').forEach(btn => {
            btn.classList.remove('active');
        });

        // Add active class to selected button
        button.classList.add('active');
        this.selectedCategory = button.dataset.category;
    }

    switchFilter(tab) {
        // Remove active class from all tabs
        document.querySelectorAll('.filter-tab').forEach(t => {
            t.classList.remove('active');
        });

        // Add active class to selected tab
        tab.classList.add('active');
        this.currentFilter = tab.dataset.filter;

        // Re-render transactions with filter
        this.renderTransactions();
    }

    handleSubmit(e) {
        e.preventDefault();

        // Validate category selection
        if (!this.selectedCategory) {
            this.showNotification('Por favor selecciona una categoría', 'warning');
            return;
        }

        // Get form values
        const description = document.getElementById('description').value.trim();
        const amount = parseFloat(document.getElementById('amount').value);
        const date = document.getElementById('date').value;

        // Create transaction object
        const transaction = {
            id: Date.now(),
            description,
            amount,
            category: this.selectedCategory,
            type: this.transactionType,
            date,
            timestamp: new Date().toISOString()
        };

        // Add transaction
        this.addTransaction(transaction);

        // Reset form
        this.resetForm();

        // Show success notification
        const message = this.transactionType === 'income'
            ? '¡Ingreso agregado exitosamente! 💚'
            : '¡Gasto registrado exitosamente! 📊';
        this.showNotification(message, 'success');
    }

    addTransaction(transaction) {
        this.transactions.unshift(transaction); // Add to beginning of array
        this.saveTransactions();
        this.renderTransactions();
        this.updateStats();
        this.updateBadges();
    }

    deleteTransaction(id) {
        this.transactions = this.transactions.filter(t => t.id !== id);
        this.saveTransactions();
        this.renderTransactions();
        this.updateStats();
        this.updateBadges();
        this.showNotification('Transacción eliminada', 'info');
    }

    renderTransactions() {
        const transactionsList = document.getElementById('transactions-list');

        // Filter transactions based on current filter
        let filteredTransactions = this.transactions;
        if (this.currentFilter !== 'all') {
            filteredTransactions = this.transactions.filter(t => t.type === this.currentFilter);
        }

        if (filteredTransactions.length === 0) {
            const emptyMessage = this.currentFilter === 'all'
                ? 'No hay transacciones registradas aún'
                : this.currentFilter === 'income'
                    ? 'No hay ingresos registrados'
                    : 'No hay gastos registrados';

            transactionsList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-inbox"></i>
                    <p>${emptyMessage}</p>
                </div>
            `;
            return;
        }

        transactionsList.innerHTML = filteredTransactions
            .map(transaction => this.createTransactionHTML(transaction))
            .join('');

        // Add delete event listeners
        document.querySelectorAll('.transaction-delete').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = parseInt(btn.dataset.id);
                this.deleteTransaction(id);
            });
        });
    }

    createTransactionHTML(transaction) {
        const icon = this.getCategoryIcon(transaction.category);
        const formattedDate = this.formatDate(transaction.date);
        const formattedAmount = this.formatCurrency(transaction.amount);
        const sign = transaction.type === 'income' ? '+' : '-';

        return `
            <div class="transaction-item ${transaction.type}" data-category="${transaction.category}">
                <div class="transaction-icon">
                    <i class="${icon}"></i>
                </div>
                <div class="transaction-details">
                    <div class="transaction-description">${transaction.description}</div>
                    <div class="transaction-meta">
                        <span class="transaction-category">
                            <i class="fas fa-tag"></i>
                            ${this.getCategoryName(transaction.category)}
                        </span>
                        <span>•</span>
                        <span class="transaction-date">
                            <i class="fas fa-calendar"></i>
                            ${formattedDate}
                        </span>
                    </div>
                </div>
                <div class="transaction-amount">${sign}${formattedAmount}</div>
                <button class="transaction-delete" data-id="${transaction.id}" title="Eliminar transacción">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </div>
        `;
    }

    updateStats() {
        // Calculate totals
        const incomeTotal = this.transactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);

        const expenseTotal = this.transactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);

        const balance = incomeTotal - expenseTotal;

        // Update DOM
        document.getElementById('total-income').textContent = this.formatCurrency(incomeTotal);
        document.getElementById('total-expense').textContent = this.formatCurrency(expenseTotal);
        document.getElementById('balance').textContent = this.formatCurrency(balance);
        document.getElementById('total-transactions').textContent = this.transactions.length;
    }

    updateBadges() {
        const incomeCount = this.transactions.filter(t => t.type === 'income').length;
        const expenseCount = this.transactions.filter(t => t.type === 'expense').length;

        document.getElementById('badge-all').textContent = this.transactions.length;
        document.getElementById('badge-income').textContent = incomeCount;
        document.getElementById('badge-expense').textContent = expenseCount;
    }

    resetForm() {
        document.getElementById('transaction-form').reset();
        this.setDefaultDate();
        this.selectedCategory = null;
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.classList.remove('active');
        });
    }

    // Utility functions
    getCategoryIcon(category) {
        const icons = {
            // Expense categories
            food: 'fas fa-utensils',
            transport: 'fas fa-car',
            entertainment: 'fas fa-gamepad',
            shopping: 'fas fa-shopping-bag',
            health: 'fas fa-heartbeat',
            bills: 'fas fa-file-invoice-dollar',
            // Income categories
            salary: 'fas fa-briefcase',
            freelance: 'fas fa-laptop-code',
            investment: 'fas fa-chart-line',
            // Common
            other: 'fas fa-ellipsis-h'
        };
        return icons[category] || 'fas fa-ellipsis-h';
    }

    getCategoryName(category) {
        const names = {
            // Expense categories
            food: 'Comida',
            transport: 'Transporte',
            entertainment: 'Ocio',
            shopping: 'Compras',
            health: 'Salud',
            bills: 'Facturas',
            // Income categories
            salary: 'Salario',
            freelance: 'Freelance',
            investment: 'Inversión',
            // Common
            other: 'Otros'
        };
        return names[category] || 'Otros';
    }

    formatCurrency(amount) {
        return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS',
            minimumFractionDigits: 0,
            maximumFractionDigits: 2
        }).format(amount);
    }

    formatDate(dateString) {
        const date = new Date(dateString + 'T00:00:00');
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        // Reset time for comparison
        today.setHours(0, 0, 0, 0);
        yesterday.setHours(0, 0, 0, 0);
        date.setHours(0, 0, 0, 0);

        if (date.getTime() === today.getTime()) {
            return 'Hoy';
        } else if (date.getTime() === yesterday.getTime()) {
            return 'Ayer';
        } else {
            return new Intl.DateTimeFormat('es-AR', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
            }).format(date);
        }
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');

        let bgColor;
        let icon;

        switch (type) {
            case 'success':
                bgColor = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
                icon = '<i class="fas fa-check-circle"></i>';
                break;
            case 'warning':
                bgColor = 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)';
                icon = '<i class="fas fa-exclamation-triangle"></i>';
                break;
            case 'error':
                bgColor = 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';
                icon = '<i class="fas fa-times-circle"></i>';
                break;
            default:
                bgColor = 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)';
                icon = '<i class="fas fa-info-circle"></i>';
        }

        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            background: ${bgColor};
            color: white;
            border-radius: 10px;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
            font-weight: 600;
            z-index: 1000;
            display: flex;
            align-items: center;
            gap: 0.75rem;
            animation: slideInRight 0.3s ease;
            max-width: 350px;
            font-size: 0.9rem;
        `;

        notification.innerHTML = `${icon}<span>${message}</span>`;

        document.body.appendChild(notification);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // LocalStorage functions
    saveTransactions() {
        localStorage.setItem('financial-transactions', JSON.stringify(this.transactions));
    }

    loadTransactions() {
        const stored = localStorage.getItem('financial-transactions');
        return stored ? JSON.parse(stored) : [];
    }
}

// Add animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(100px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes fadeOut {
        to {
            opacity: 0;
            transform: translateX(100px);
        }
    }
`;
document.head.appendChild(style);

// Initialize the app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new FinancialTracker();
});
