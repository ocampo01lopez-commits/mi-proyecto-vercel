class DashboardPro {
    constructor() {
        this.defaultUsers = [
            { user: "santiago", pass: "123", name: "Santiago", mustChange: true },
            { user: "barbara", pass: "456", name: "Barbara", mustChange: true },
            { user: "manager", pass: "admin789", name: "Josue", mustChange: true }
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
        
        // Forzar actualización del nombre si ya existía en el navegador
        this.users = this.users.map(u => {
            if (u.user === "manager") return { ...u, name: "Josue" };
            return u;
        });
    }

    saveUsers() {
        localStorage.setItem("app_users", JSON.stringify(this.users));
    }

    setupAuth() {
        document.getElementById("loginForm").onsubmit = (e) => {
            e.preventDefault();
            const u = document.getElementById("loginUser").value.toLowerCase();
            const p = document.getElementById("loginPass").value;
            const found = this.users.find(user => user.user === u && user.pass === p);
            
            if (found) {
                if (found.mustChange) {
                    this.tempUser = found;
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

        document.getElementById("changePassForm").onsubmit = (e) => {
            e.preventDefault();
            const n1 = document.getElementById("newPass").value;
            const n2 = document.getElementById("confirmPass").value;
            if (n1 !== n2) {
                document.getElementById("passError").textContent = "Las contraseñas no coinciden";
                return;
            }
            this.users = this.users.map(u => {
                if (u.user === this.tempUser.user) return { ...u, pass: n1, mustChange: false };
                return u;
            });
            this.saveUsers();
            localStorage.setItem("session", JSON.stringify(this.users.find(u => u.user === this.tempUser.user)));
            window.location.reload();
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

    setupEventListeners() {
        document.getElementById("transactionForm").onsubmit = (e) => this.handleSubmit(e);
        document.getElementById("searchInput").oninput = (e) => this.renderTable(e.target.value);
        document.getElementById("toggleTheme").onclick = () => {
            document.body.classList.toggle("dark");
            localStorage.setItem("theme", document.body.classList.contains("dark") ? "dark" : "light");
        };
        document.getElementById("cancelEditBtn").onclick = () => this.cancelEdit();
    }

    handleSubmit(e) {
        e.preventDefault();
        const type = document.getElementById("type").value;
        let amount = Math.abs(parseFloat(document.getElementById("amount").value));
        if (type === "expense") amount = -amount;

        const tx = { 
            id: this.editId || Date.now(), 
            description: document.getElementById("description").value, 
            amount, 
            category: document.getElementById("category").value, 
            date: document.getElementById("dateInput").value 
        };

        if (this.editId) this.transactions = this.transactions.map(t => t.id === this.editId ? tx : t);
        else this.transactions.push(tx);

        this.saveStorage();
        this.updateUI();
        this.cancelEdit();
        document.getElementById("transactionForm").reset();
    }

    initCharts() {
        const ctx1 = document.getElementById('categoryChart').getContext('2d');
        this.charts.category = new Chart(ctx1, {
            type: 'doughnut',
            data: { labels: [], datasets: [{ data: [], backgroundColor: ['#4f46e5', '#10b981', '#ef4444', '#f59e0b', '#3b82f6'] }] },
            options: { maintainAspectRatio: false }
        });
        const ctx2 = document.getElementById('trendChart').getContext('2d');
        this.charts.trend = new Chart(ctx2, {
            type: 'bar',
            data: { labels: ['Ingresos', 'Gastos'], datasets: [{ label: 'Lps', data: [0, 0], backgroundColor: ['#10b981', '#ef4444'] }] },
            options: { maintainAspectRatio: false }
        });
    }

    updateCharts() {
        const exp = this.transactions.filter(t => t.amount < 0);
        const cats = {};
        exp.forEach(t => cats[t.category] = (cats[t.category] || 0) + Math.abs(t.amount));
        this.charts.category.data.labels = Object.keys(cats);
        this.charts.category.data.datasets[0].data = Object.values(cats);
        this.charts.category.update();

        const incTotal = this.transactions.filter(t => t.amount > 0).reduce((s, t) => s + t.amount, 0);
        const expTotal = this.transactions.filter(t => t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0);
        this.charts.trend.data.datasets[0].data = [incTotal, expTotal];
        this.charts.trend.update();
    }

    renderTable(filter = "") {
        const tbody = document.querySelector("#transactionTable tbody");
        tbody.innerHTML = "";
        this.transactions
            .filter(t => t.description.toLowerCase().includes(filter.toLowerCase()))
            .sort((a,b) => new Date(b.date) - new Date(a.date))
            .forEach(t => {
                const tr = document.createElement("tr");
                tr.innerHTML = `
                    <td>${t.date}</td>
                    <td>${t.description}</td>
                    <td>${t.category}</td>
                    <td class="${t.amount > 0 ? 'amount-inc' : 'amount-exp'}">L ${Math.abs(t.amount).toFixed(2)}</td>
                    <td>
                        <button onclick="window.app.loadEdit(${t.id})">✏️</button>
                        <button onclick="window.app.deleteTx(${t.id})">🗑️</button>
                    </td>
                `;
                tbody.appendChild(tr);
            });
    }

    loadEdit(id) {
        const t = this.transactions.find(tx => tx.id === id);
        this.editId = id;
        document.getElementById("description").value = t.description;
        document.getElementById("amount").value = Math.abs(t.amount);
        document.getElementById("type").value = t.amount > 0 ? "income" : "expense";
        document.getElementById("category").value = t.category;
        document.getElementById("dateInput").value = t.date;
        document.getElementById("submitBtn").textContent = "Actualizar";
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
        const inc = this.transactions.filter(t => t.amount > 0).reduce((s, t) => s + t.amount, 0);
        const exp = this.transactions.filter(t => t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0);
        document.getElementById("totalIncome").textContent = `L ${inc.toFixed(2)}`;
        document.getElementById("totalExpense").textContent = `L ${exp.toFixed(2)}`;
        document.getElementById("totalSavings").textContent = `L ${(inc - exp).toFixed(2)}`;
    }

    saveStorage() { localStorage.setItem("transactions", JSON.stringify(this.transactions)); }
    loadStorage() { this.transactions = JSON.parse(localStorage.getItem("transactions")) || []; }
    loadTheme() { if(localStorage.getItem("theme") === "dark") document.body.classList.add("dark"); }
    cancelEdit() { this.editId = null; document.getElementById("submitBtn").textContent = "Agregar Movimiento"; document.getElementById("cancelEditBtn").hidden = true; }
}

window.app = new DashboardPro();