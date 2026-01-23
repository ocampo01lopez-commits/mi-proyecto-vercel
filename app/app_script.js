class DashboardPro {
    constructor() {
        this.defaultUsers = [
            { user: "santiago", pass: "123", name: "Santiago", mustChange: true },
            { user: "barbara", pass: "456", name: "Barbara", mustChange: true },
            { user: "manager", pass: "admin789", name: "Josue (Manager)", mustChange: true }
        ];
        this.transactions = [];
        this.editId = null;
        this.charts = {};
        this.init();
    }

    init() {
        this.loadUsers();
        this.setupAuth();
        this.checkSession();
        this.loadTheme();
    }

    loadUsers() {
        const savedUsers = localStorage.getItem("app_users");
        this.users = savedUsers ? JSON.parse(savedUsers) : this.defaultUsers;
    }

    saveUsers() {
        localStorage.setItem("app_users", JSON.stringify(this.users));
    }

    setupAuth() {
        // Formulario de Login
        document.getElementById("loginForm").onsubmit = (e) => {
            e.preventDefault();
            const u = document.getElementById("loginUser").value.toLowerCase();
            const p = document.getElementById("loginPass").value;
            const found = this.users.find(user => user.user === u && user.pass === p);
            
            if (found) {
                if (found.mustChange) {
                    this.tempUser = found; // Guardar temporalmente para el cambio
                    document.getElementById("login-screen").style.display = "none";
                    document.getElementById("password-modal").style.display = "flex";
                } else {
                    localStorage.setItem("session", JSON.stringify(found));
                    this.checkSession();
                }
            } else {
                document.getElementById("loginError").textContent = "Usuario o clave incorrecta";
            }
        };

        // Formulario de Cambio de Contraseña
        document.getElementById("changePassForm").onsubmit = (e) => {
            e.preventDefault();
            const n1 = document.getElementById("newPass").value;
            const n2 = document.getElementById("confirmPass").value;

            if (n1 !== n2) {
                document.getElementById("passError").textContent = "Las contraseñas no coinciden";
                return;
            }

            // Actualizar usuario en la lista persistente
            this.users = this.users.map(u => {
                if (u.user === this.tempUser.user) {
                    return { ...u, pass: n1, mustChange: false };
                }
                return u;
            });

            this.saveUsers();
            const updatedUser = this.users.find(u => u.user === this.tempUser.user);
            localStorage.setItem("session", JSON.stringify(updatedUser));
            document.getElementById("password-modal").style.display = "none";
            this.checkSession();
        };

        document.getElementById("logoutBtn").onclick = () => {
            localStorage.removeItem("session");
            window.location.reload();
        };
    }

    checkSession() {
        const session = localStorage.getItem("session");
        if (session) {
            this.currentUser = JSON.parse(session);
            document.getElementById("login-screen").style.display = "none";
            document.getElementById("password-modal").style.display = "none";
            document.getElementById("app-content").style.display = "block";
            document.getElementById("userNameDisplay").textContent = this.currentUser.name;
            this.startApp();
        }
    }

    startApp() {
        this.loadStorage();
        this.setupEventListeners();
        this.initCharts();
        this.updateUI();
    }

    // --- LÓGICA DE TRANSACCIONES ---
    setupEventListeners() {
        document.getElementById("transactionForm").onsubmit = (e) => this.handleSubmit(e);
        document.getElementById("searchInput").oninput = (e) => this.renderTable(e.target.value);
        document.getElementById("toggleTheme").onclick = () => this.toggleTheme();
        document.getElementById("cancelEditBtn").onclick = () => this.cancelEdit();
    }

    handleSubmit(e) {
        e.preventDefault();
        const type = document.getElementById("type").value;
        const desc = document.getElementById("description").value;
        let amount = Math.abs(parseFloat(document.getElementById("amount").value));
        const category = document.getElementById("category").value;
        const date = document.getElementById("dateInput").value;
        if (type === "expense") amount = -amount;

        const tx = { id: this.editId || Date.now(), description: desc, amount, category, date };
        if (this.editId) {
            this.transactions = this.transactions.map(t => t.id === this.editId ? tx : t);
            this.cancelEdit();
        } else {
            this.transactions.push(tx);
        }
        this.saveStorage();
        this.updateUI();
        document.getElementById("transactionForm").reset();
    }

    initCharts() {
        const ctxCat = document.getElementById('categoryChart').getContext('2d');
        this.charts.category = new Chart(ctxCat, {
            type: 'doughnut',
            data: { labels: [], datasets: [{ data: [], backgroundColor: ['#4f46e5', '#10b981', '#ef4444', '#f59e0b', '#3b82f6'] }] },
            options: { maintainAspectRatio: false }
        });

        const ctxTrend = document.getElementById('trendChart').getContext('2d');
        this.charts.trend = new Chart(ctxTrend, {
            type: 'bar',
            data: { labels: ['Ingresos', 'Gastos'], datasets: [{ label: 'Lps', data: [0, 0], backgroundColor: ['#10b981', '#ef4444'] }] },
            options: { maintainAspectRatio: false }
        });
    }

    updateCharts() {
        const expenses = this.transactions.filter(t => t.amount < 0);
        const cats = {};
        expenses.forEach(t => cats[t.category] = (cats[t.category] || 0) + Math.abs(t.amount));
        this.charts.category.data.labels = Object.keys(cats);
        this.charts.category.data.datasets[0].data = Object.values(cats);
        this.charts.category.update();

        const inc = this.transactions.filter(t => t.amount > 0).reduce((s, t) => s + t.amount, 0);
        const exp = this.transactions.filter(t => t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0);
        this.charts.trend.data.datasets[0].data = [inc, exp];
        this.charts.trend.update();
    }

    renderTable(filter = "") {
        const tbody = document.querySelector("#transactionTable tbody");
        tbody.innerHTML = "";
        const filtered = this.transactions.filter(t => t.description.toLowerCase().includes(filter.toLowerCase()));
        filtered.sort((a,b) => new Date(b.date) - new Date(a.date)).forEach(t => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${t.date}</td>
                <td>${t.description}</td>
                <td>${t.category}</td>
                <td class="${t.amount > 0 ? 'amount-inc' : 'amount-exp'}">L ${Math.abs(t.amount).toFixed(2)}</td>
                <td>
                    <button class="btn-icon" onclick="window.app.loadEdit(${t.id})">✏️</button>
                    <button class="btn-icon" onclick="window.app.deleteTx(${t.id})">🗑️</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }

    loadEdit(id) {
        const t = this.transactions.find(tx => tx.id === id);
        this.editId = id;
        document.getElementById("type").value = t.amount > 0 ? "income" : "expense";
        document.getElementById("description").value = t.description;
        document.getElementById("amount").value = Math.abs(t.amount);
        document.getElementById("category").value = t.category;
        document.getElementById("dateInput").value = t.date;
        document.getElementById("submitBtn").textContent = "Guardar Cambios";
        document.getElementById("cancelEditBtn").hidden = false;
    }

    deleteTx(id) {
        if(confirm("¿Eliminar?")) {
            this.transactions = this.transactions.filter(t => t.id !== id);
            this.saveStorage();
            this.updateUI();
        }
    }

    updateUI() {
        this.renderTable();
        this.updateCharts();
        const income = this.transactions.filter(t => t.amount > 0).reduce((s, t) => s + t.amount, 0);
        const expense = this.transactions.filter(t => t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0);
        document.getElementById("totalIncome").textContent = `L ${income.toFixed(2)}`;
        document.getElementById("totalExpense").textContent = `L ${expense.toFixed(2)}`;
        document.getElementById("totalSavings").textContent = `L ${(income - expense).toFixed(2)}`;
    }

    saveStorage() { localStorage.setItem("transactions", JSON.stringify(this.transactions)); }
    loadStorage() { this.transactions = JSON.parse(localStorage.getItem("transactions")) || []; }
    toggleTheme() { document.body.classList.toggle("dark"); }
    loadTheme() { if(localStorage.getItem("theme") === "dark") document.body.classList.add("dark"); }
    cancelEdit() { this.editId = null; document.getElementById("submitBtn").textContent = "Agregar Movimiento"; document.getElementById("cancelEditBtn").hidden = true; }
}

window.app = new DashboardPro();