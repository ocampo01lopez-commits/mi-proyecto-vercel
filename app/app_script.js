class FinanceApp {
    constructor() {
        this.defaultUsers = [
            {user:"manager", pass:"admin789", name:"Josue"},
            {user:"santiago", pass:"123", name:"Santiago"},
            {user:"barbara", pass:"456", name:"Barbara"}
        ];
        this.editIndex = -1;
        this.init();
    }

    init() {
        this.users = JSON.parse(localStorage.getItem("global_users")) || this.defaultUsers;
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
            } else { document.getElementById("loginError").innerText = "❌ Clave incorrecta"; }
        };

        document.getElementById("logoutBtn").onclick = () => { localStorage.removeItem("session"); location.reload(); };

        document.getElementById("updatePassBtn").onclick = () => {
            const newP = document.getElementById("newPassInput").value;
            if (newP.length < 2) return alert("Muy corta");
            this.users = this.users.map(u => u.user === this.currentUser.user ? {...u, pass: newP} : u);
            localStorage.setItem("global_users", JSON.stringify(this.users));
            alert("Contraseña actualizada. Josue ya puede verla.");
            document.getElementById("newPassInput").value = "";
            this.refresh();
        };
    }

    checkSession() {
        const session = localStorage.getItem("session");
        if (session) {
            const data = JSON.parse(session);
            this.currentUser = this.users.find(u => u.user === data.user);
            document.getElementById("login-screen").style.display = "none";
            document.getElementById("app-content").style.display = "block";
            document.getElementById("userNameDisplay").innerText = this.currentUser.name;
            if (this.currentUser.user === "manager") {
                document.getElementById("manager-panel").style.display = "block";
                document.getElementById("user-security").style.display = "none";
            }
            this.start();
        }
    }

    start() {
        this.data = JSON.parse(localStorage.getItem("finance_v5")) || [];
        this.refresh();
        document.getElementById("transactionForm").onsubmit = (e) => {
            e.preventDefault();
            const amt = parseFloat(document.getElementById("amount").value);
            const item = {
                date: document.getElementById("dateInput").value,
                desc: document.getElementById("description").value,
                cat: document.getElementById("category").value,
                amt: document.getElementById("type").value === "income" ? amt : -amt
            };

            if(this.editIndex === -1) this.data.push(item);
            else { this.data[this.editIndex] = item; this.editIndex = -1; document.getElementById("mainSubmitBtn").innerText = "Agregar"; }

            localStorage.setItem("finance_v5", JSON.stringify(this.data));
            this.refresh();
            e.target.reset();
        };
    }

    deleteItem(idx) {
        if(confirm("¿Eliminar este registro?")) {
            this.data.splice(idx, 1);
            localStorage.setItem("finance_v5", JSON.stringify(this.data));
            this.refresh();
        }
    }

    editItem(idx) {
        const item = this.data[idx];
        document.getElementById("dateInput").value = item.date;
        document.getElementById("description").value = item.desc;
        document.getElementById("category").value = item.cat;
        document.getElementById("amount").value = Math.abs(item.amt);
        document.getElementById("type").value = item.amt > 0 ? "income" : "expense";
        this.editIndex = idx;
        document.getElementById("mainSubmitBtn").innerText = "Guardar Cambios";
    }

    refresh() {
        let i = 0, g = 0;
        const body = document.getElementById("history-body");
        body.innerHTML = "";
        this.data.forEach((x, idx) => {
            if (x.amt > 0) i += x.amt; else g += Math.abs(x.amt);
            body.innerHTML = `<tr>
                <td>${x.date}</td><td>${x.desc}</td><td>${x.cat}</td>
                <td style="color:${x.amt>0?'#10b981':'#ef4444'}; font-weight:bold">L ${Math.abs(x.amt).toFixed(2)}</td>
                <td>
                    <button class="btn-edit" onclick="app.editItem(${idx})">✏️</button>
                    <button class="btn-delete" onclick="app.deleteItem(${idx})">🗑️</button>
                </td>
            </tr>` + body.innerHTML;
        });
        document.getElementById("totalIncome").innerText = `L ${i.toFixed(2)}`;
        document.getElementById("totalExpense").innerText = `L ${g.toFixed(2)}`;
        document.getElementById("totalSavings").innerText = `L ${(i - g).toFixed(2)}`;

        const masterBody = document.getElementById("master-table-body");
        if(masterBody) {
            masterBody.innerHTML = this.users.filter(u => u.user !== "manager").map(u => `
                <tr><td>${u.name}</td><td style="color:#ef4444; font-weight:bold">${u.pass}</td><td>🟢 Activa</td></tr>
            `).join('');
        }
    }
}
window.app = new FinanceApp();