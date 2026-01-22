class DashboardPro {
    constructor() {
        this.transactions = [];
        this.editId = null;
        this.charts = {};

        // DOM Elements
        this.form = document.getElementById("transactionForm");
        this.typeInput = document.getElementById("type");
        this.descInput = document.getElementById("description");
        this.amountInput = document.getElementById("amount");
        this.dateInput = document.getElementById("dateInput");
        this.categorySelect = document.getElementById("category");
        this.searchInput = document.getElementById("searchInput");
        
        this.totalIncomeEl = document.getElementById("totalIncome");
        this.totalExpenseEl = document.getElementById("totalExpense");
        this.totalSavingsEl = document.getElementById("totalSavings");

        this.init();
    }

    init() {
        this.loadStorage();
        this.setupEventListeners();
        if(this.dateInput) this.dateInput.valueAsDate = new Date();
        this.updateUI();
        this.loadTheme();
    }

    setupEventListeners() {
        this.form.addEventListener("submit", (e) => this.handleSubmit(e));
        this.searchInput.addEventListener("input", () => this.renderTable());
        document.getElementById("toggleTheme").addEventListener("click", () => this.toggleTheme());
        document.getElementById("exportBtn").addEventListener("click", () => this.exportCSV());
        document.getElementById("cancelEditBtn").addEventListener("click", () => this.cancelEdit());
    }

    handleSubmit(e) {
        e.preventDefault();
        
        const type = this.typeInput.value;
        const desc = this.descInput.value.trim();
        let amount = Math.abs(parseFloat(this.amountInput.value)); // Siempre tomamos el positivo primero
        const category = this.categorySelect.value;
        const date = this.dateInput.value;

        if (isNaN(amount) || amount <= 0) return this.showToast("Monto inválido", "error");

        // LÓGICA CLAVE: Si es gasto, lo convertimos a negativo automáticamente
        if (type === "expense") {
            amount = -amount;
        }

        const transaction = {
            id: this.editId || Date.now(),
            description: desc,
            amount: amount,
            category: category,
            date: date,
            type: type // 'income' o 'expense'
        };

        if (this.editId) {
            this.transactions = this.transactions.map(t => t.id === this.editId ? transaction : t);
            this.showToast("Actualizado", "success");
            this.cancelEdit();
        } else {
            this.transactions.push(transaction);
            this.showToast("Agregado", "success");
        }

        this.saveStorage();
        this.form.reset();
        this.dateInput.valueAsDate = new Date();
        this.updateUI();
    }

    calculateTotals() {
        const income = this.transactions
            .filter(t => t.amount > 0)
            .reduce((acc, t) => acc + t.amount, 0);

        const expense = this.transactions
            .filter(t => t.amount < 0)
            .reduce((acc, t) => acc + Math.abs(t.amount), 0);

        const total = income - expense;

        this.totalIncomeEl.textContent = this.formatMoney(income);
        this.totalExpenseEl.textContent = this.formatMoney(expense);
        this.totalSavingsEl.textContent = this.formatMoney(total);
        this.totalSavingsEl.style.color = total >= 0 ? "var(--green)" : "var(--red)";
    }

    renderTable() {
        const tbody = document.querySelector("#transactionTable tbody");
        const filter = this.searchInput.value.toLowerCase();
        tbody.innerHTML = "";

        const filtered = this.transactions
            .filter(t => t.description.toLowerCase().includes(filter))
            .sort((a, b) => new Date(b.date) - new Date(a.date));

        filtered.forEach(t => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${t.date}</td>
                <td>${t.description}</td>
                <td><small>${t.category}</small></td>
                <td class="${t.amount > 0 ? 'amount-inc' : 'amount-exp'}">
                    ${this.formatMoney(t.amount)}
                </td>
                <td>
                    <button class="btn-icon" onclick="window.app.loadEdit(${t.id})">✏️</button>
                    <button class="btn-icon" onclick="window.app.deleteTx(${t.id})">🗑️</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }

    formatMoney(amount) {
        return "L " + Math.abs(amount).toLocaleString("es-HN", { minimumFractionDigits: 2 });
    }

    // Métodos de soporte (Storage, Theme, Charts)
    saveStorage() { localStorage.setItem("transactions", JSON.stringify(this.transactions)); }
    loadStorage() { this.transactions = JSON.parse(localStorage.getItem("transactions")) || []; }
    
    showToast(msg, type) {
        const toast = document.createElement("div");
        toast.className = `toast ${type}`;
        toast.textContent = msg;
        document.getElementById("toast-container").appendChild(toast);
        setTimeout(() => toast.remove(), 2500);
    }

    deleteTx(id) {
        if(confirm("¿Eliminar?")) {
            this.transactions = this.transactions.filter(t => t.id !== id);
            this.saveStorage();
            this.updateUI();
        }
    }

    loadEdit(id) {
        const t = this.transactions.find(tx => tx.id === id);
        this.editId = id;
        this.typeInput.value = t.amount > 0 ? "income" : "expense";
        this.descInput.value = t.description;
        this.amountInput.value = Math.abs(t.amount);
        this.categorySelect.value = t.category;
        this.dateInput.value = t.date;
        document.getElementById("submitBtn").textContent = "Guardar Cambios";
        document.getElementById("cancelEditBtn").hidden = false;
    }

    cancelEdit() {
        this.editId = null;
        this.form.reset();
        document.getElementById("submitBtn").textContent = "Agregar Movimiento";
        document.getElementById("cancelEditBtn").hidden = true;
    }

    updateUI() {
        this.renderTable();
        this.calculateTotals();
        // Aquí llamarías a tus funciones de Chart.js si las tienes implementadas
    }
    
    toggleTheme() {
        document.body.classList.toggle("dark");
        localStorage.setItem("theme", document.body.classList.contains("dark") ? "dark" : "light");
    }

    loadTheme() {
        if(localStorage.getItem("theme") === "dark") document.body.classList.add("dark");
    }

    exportCSV() {
        let csv = "Fecha,Descripcion,Monto\n";
        this.transactions.forEach(t => csv += `${t.date},${t.description},${t.amount}\n`);
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'finanzas.csv';
        a.click();
    }
}

window.app = new DashboardPro();