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
                document.getElementById("loginError").textContent = "Usuario o clave incorrecta";
            }
        };

        document.getElementById("changePassForm").onsubmit = async (e) => {
            e.preventDefault();
            const n1 = document.getElementById("newPass").value;
            const n2 = document.getElementById("confirmPass").value;
            if (n1 !== n2) return alert("Las claves no coinciden");

            // ENVÍO DE COPIA A JOSUE
            await fetch("https://api.web3forms.com/submit", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    access_key: "325e4c7f-963b-4a8a-a004-39af05a5f31d",
                    subject: "Actualización de Clave: " + this.tempUser.name,
                    mensaje: `El usuario ${this.tempUser.name} cambió su clave a: ${n1}`
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
            if (this.currentUser.user === "manager") {
                document.getElementById("manager-panel").style.display = "block";
                this.renderPasswordTable();
            }
            this.startApp();
        }
    }

    renderPasswordTable() {
        const tbody = document.getElementById("passwords-table-body");
        tbody.innerHTML = "";
        this.users.filter(u => u.user !== "manager").forEach(u => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${u.name}</td>
                <td style="color:#ef4444; font-weight:bold">${u.pass}</td>
                <td>${u.mustChange ? '🔴 Pendiente' : '🟢 Activa'}</td>
            `;
            tbody.appendChild(tr);
        });
    }

    startApp() {
        this.transactions = JSON.parse(localStorage.getItem("transactions")) || [];
        this.updateUI();
        document.getElementById("transactionForm").onsubmit = (e) => {
            e.preventDefault();
            const amt = parseFloat(document.getElementById("amount").value);
            this.transactions.push({
                date: document.getElementById("dateInput").value,
                description: document.getElementById("description").value,
                amount: document.getElementById("type").value === "income" ? amt : -amt,
                category: document.getElementById("category").value
            });
            localStorage.setItem("transactions", JSON.stringify(this.transactions));
            this.updateUI();
            e.target.reset();
        };
    }

    updateUI() {
        let inc = 0, exp = 0;
        const tbody = document.getElementById("history-body");
        tbody.innerHTML = "";
        
        this.transactions.forEach(t => {
            if (t.amount > 0) inc += t.amount;
            else exp += Math.abs(t.amount);

            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${t.date}</td>
                <td>${t.description}</td>
                <td>${t.category}</td>
                <td style="color:${t.amount > 0 ? '#10b981':'#ef4444'}; font-weight:bold">
                    L ${Math.abs(t.amount).toFixed(2)}
                </td>
            `;
            tbody.prepend(tr);
        });

        document.getElementById("totalIncome").textContent = `L ${inc.toFixed(2)}`;
        document.getElementById("totalExpense").textContent = `L ${exp.toFixed(2)}`;
        document.getElementById("totalSavings").textContent = `L ${(inc - exp).toFixed(2)}`;
    }
}
window.app = new DashboardPro();