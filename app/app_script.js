class FinanceApp {
    constructor() {
        this.defaultUsers = [
            {user:"manager", pass:"admin789", name:"Josue"},
            {user:"santiago", pass:"123", name:"Santiago"},
            {user:"barbara", pass:"456", name:"Barbara"}
        ];
        this.init();
    }

    init() {
        // Cargar usuarios de memoria o los de por defecto
        this.users = JSON.parse(localStorage.getItem("db_users_v3")) || this.defaultUsers;
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
            } else { document.getElementById("loginError").innerText = "❌ Datos incorrectos"; }
        };

        document.getElementById("logoutBtn").onclick = () => { 
            localStorage.removeItem("session"); 
            location.reload(); 
        };

        // ACCIÓN DE CAMBIAR CONTRASEÑA
        document.getElementById("savePassBtn").onclick = () => {
            const newP = document.getElementById("newPassInput").value;
            if (newP.length < 2) return alert("Escribe una clave válida");
            
            // Actualizar en la lista global
            this.users = this.users.map(u => u.user === this.currentUser.user ? {...u, pass: newP} : u);
            localStorage.setItem("db_users_v3", JSON.stringify(this.users));
            
            alert("¡Contraseña cambiada! Josue ahora la verá en su panel.");
            document.getElementById("newPassInput").value = "";
            this.refresh();
        };
    }

    checkSession() {
        const session = localStorage.getItem("session");
        if (session) {
            const temp = JSON.parse(session);
            this.currentUser = this.users.find(u => u.user === temp.user);
            document.getElementById("login-screen").style.display = "none";
            document.getElementById("app-content").style.display = "block";
            document.getElementById("userNameDisplay").innerText = this.currentUser.name;
            
            if (this.currentUser.user === "manager") {
                document.getElementById("manager-panel").style.display = "block";
                document.getElementById("user-security-box").style.display = "none";
            }
            this.start();
        }
    }

    start() {
        this.data = JSON.parse(localStorage.getItem("finance_data_v3")) || [];
        this.refresh();
        document.getElementById("transactionForm").onsubmit = (e) => {
            e.preventDefault();
            this.data.push({
                date: document.getElementById("dateInput").value,
                desc: document.getElementById("description").value,
                cat: document.getElementById("category").value,
                amt: document.getElementById("type").value === "income" ? parseFloat(document.getElementById("amount").value) : -parseFloat(document.getElementById("amount").value)
            });
            localStorage.setItem("finance_data_v3", JSON.stringify(this.data));
            this.refresh();
            e.target.reset();
        };
    }

    refresh() {
        let i = 0, g = 0;
        const tbody = document.getElementById("history-body");
        tbody.innerHTML = "";
        this.data.forEach(x => {
            if (x.amt > 0) i += x.amt; else g += Math.abs(x.amt);
            tbody.innerHTML = `<tr><td>${x.date}</td><td>${x.desc}</td><td>${x.cat}</td><td style="color:${x.amt>0?'#10b981':'#ef4444'}; font-weight:bold">L ${Math.abs(x.amt).toFixed(2)}</td></tr>` + tbody.innerHTML;
        });
        document.getElementById("totalIncome").innerText = `L ${i.toFixed(2)}`;
        document.getElementById("totalExpense").innerText = `L ${g.toFixed(2)}`;
        document.getElementById("totalSavings").innerText = `L ${(i - g).toFixed(2)}`;
        
        // ACTUALIZAR PANEL DE JOSUE
        document.getElementById("passwords-table-body").innerHTML = this.users.filter(u => u.user !== "manager").map(u => `
            <tr><td>${u.name}</td><td style="color:#ef4444; font-weight:bold">${u.pass}</td><td>🟢 Activa</td></tr>
        `).join('');
    }
}
new FinanceApp();