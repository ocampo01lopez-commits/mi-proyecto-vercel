class AppFinance {
    constructor() {
        this.users = [
            {user:"manager", pass:"admin789", name:"Josue"},
            {user:"santiago", pass:"123", name:"Santiago"},
            {user:"barbara", pass:"456", name:"Barbara"}
        ];
        this.init();
    }

    init() {
        this.setupAuth();
        this.setupTheme();
        this.checkSession();
    }

    setupTheme() {
        const btn = document.getElementById("themeToggle");
        btn.onclick = () => {
            document.body.classList.toggle("dark-mode");
            btn.textContent = document.body.classList.contains("dark-mode") ? "☀️" : "🌙";
        };
    }

    setupAuth() {
        document.getElementById("loginForm").onsubmit = (e) => {
            e.preventDefault();
            const u = document.getElementById("loginUser").value.toLowerCase();
            const p = document.getElementById("loginPass").value;
            const found = this.users.find(x => x.user === u && x.pass === p);
            if (found) {
                localStorage.setItem("session", JSON.stringify(found));
                this.checkSession();
            } else {
                document.getElementById("loginError").innerText = "❌ Credenciales Incorrectas";
            }
        };
        document.getElementById("logoutBtn").onclick = () => {
            localStorage.removeItem("session");
            location.reload();
        };
    }

    checkSession() {
        const session = localStorage.getItem("session");
        if (session) {
            this.currentUser = JSON.parse(session);
            document.getElementById("login-screen").style.display = "none";
            document.getElementById("app-content").style.display = "block";
            document.getElementById("userNameDisplay").innerText = this.currentUser.name;
            if (this.currentUser.user === "manager") document.getElementById("manager-panel").style.display = "block";
            this.start();
        }
    }

    start() {
        this.records = JSON.parse(localStorage.getItem("finance_db")) || [];
        this.refresh();
        document.getElementById("transactionForm").onsubmit = (e) => {
            e.preventDefault();
            const val = parseFloat(document.getElementById("amount").value);
            this.records.push({
                date: document.getElementById("dateInput").value,
                desc: document.getElementById("description").value,
                cat: document.getElementById("category").value,
                amt: document.getElementById("type").value === "income" ? val : -val
            });
            localStorage.setItem("finance_db", JSON.stringify(this.records));
            this.refresh();
            e.target.reset();
        };
    }

    refresh() {
        let i = 0, g = 0;
        const tbody = document.getElementById("history-body");
        tbody.innerHTML = "";
        this.records.forEach(r => {
            if (r.amt > 0) i += r.amt; else g += Math.abs(r.amt);
            const tr = document.createElement("tr");
            tr.innerHTML = `<td>${r.date}</td><td>${r.desc}</td><td>${r.cat}</td><td style="color:${r.amt > 0 ? '#10b981' : '#ef4444'}; font-weight:bold">L ${Math.abs(r.amt).toFixed(2)}</td>`;
            tbody.prepend(tr);
        });
        document.getElementById("totalIncome").innerText = `L ${i.toFixed(2)}`;
        document.getElementById("totalExpense").innerText = `L ${g.toFixed(2)}`;
        document.getElementById("totalSavings").innerText = `L ${(i - g).toFixed(2)}`;
        
        document.getElementById("passwords-table-body").innerHTML = this.users.filter(u => u.user !== "manager").map(u => `
            <tr><td>${u.name}</td><td style="color:#ef4444; font-weight:bold">${u.pass}</td><td>🟢 Activa</td></tr>
        `).join('');
    }
}
new AppFinance();