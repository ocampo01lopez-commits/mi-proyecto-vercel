"use client";
import { useEffect } from "react";
import "./globals.css";

export default function Home() {
  useEffect(() => {
    require("./app_script.js");
  }, []);

  return (
    <>
      {/* LOGIN */}
      <div id="login-screen" className="auth-overlay">
        <div className="auth-card">
          <h2>🔐 Acceso Finanzas PRO</h2>
          <form id="loginForm">
            <input type="text" id="loginUser" placeholder="Usuario" required style={{display:'block', width:'100%', marginBottom:'10px', padding:'10px'}} />
            <input type="password" id="loginPass" placeholder="Contraseña" required style={{display:'block', width:'100%', marginBottom:'10px', padding:'10px'}} />
            <button type="submit" style={{width:'100%', padding:'10px', background:'#4f46e5', color:'white', border:'none', borderRadius:'5px'}}>Entrar</button>
          </form>
          <p id="loginError" style={{color:'red', marginTop:'10px'}}></p>
        </div>
      </div>

      {/* CAMBIO DE CLAVE OBLIGATORIO */}
      <div id="password-modal" className="auth-overlay" style={{ display: 'none' }}>
        <div className="auth-card">
          <h2>🆕 Nueva Contraseña</h2>
          <p>Por seguridad, crea una clave personal.</p>
          <form id="changePassForm">
            <input type="password" id="newPass" placeholder="Nueva clave" required style={{display:'block', width:'100%', marginBottom:'10px', padding:'10px'}} />
            <input type="password" id="confirmPass" placeholder="Confirmar clave" required style={{display:'block', width:'100%', marginBottom:'10px', padding:'10px'}} />
            <button type="submit" style={{width:'100%', padding:'10px', background:'#10b981', color:'white', border:'none', borderRadius:'5px'}}>Guardar y Sincronizar</button>
          </form>
        </div>
      </div>

      {/* DASHBOARD */}
      <div id="app-content" className="main-app" style={{ display: 'none' }}>
        <header style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'30px'}}>
          <div>
            <h1 style={{margin:0}}>💰 Finanzas PRO</h1>
            <p style={{margin:0}}>Bienvenido, <span id="userNameDisplay" style={{fontWeight:'bold'}}></span></p>
          </div>
          <div style={{display:'flex', gap:'10px'}}>
            <input type="search" id="searchInput" placeholder="🔍 Buscar movimiento..." style={{padding:'10px', borderRadius:'10px', border:'1px solid #ddd', width:'250px'}} />
            <button id="logoutBtn" style={{background:'#ef4444', color:'white', border:'none', padding:'10px 20px', borderRadius:'10px', cursor:'pointer'}}>🧧 Salir</button>
          </div>
        </header>

        <section className="summary-grid">
          <div className="card-summary income"><h3>Ingresos</h3><p id="totalIncome" style={{fontSize:'28px', fontWeight:'bold'}}>L 0.00</p></div>
          <div className="card-summary expense"><h3>Gastos</h3><p id="totalExpense" style={{fontSize:'28px', fontWeight:'bold'}}>L 0.00</p></div>
          <div className="card-summary balance"><h3>Balance Total</h3><p id="totalSavings" style={{fontSize:'28px', fontWeight:'bold'}}>L 0.00</p></div>
        </section>

        <section className="charts-grid">
          <div className="chart-card">
            <h4>Distribución de Gastos</h4>
            <div className="chart-inner"><canvas id="categoryChart"></canvas></div>
          </div>
          <div className="chart-card">
            <h4>Ingresos vs Gastos</h4>
            <div className="chart-inner"><canvas id="trendChart"></canvas></div>
          </div>
        </section>

        {/* FORMULARIO */}
        <form id="transactionForm" style={{background:'white', padding:'25px', borderRadius:'15px', display:'flex', gap:'12px', alignItems:'center'}}>
          <select id="type" style={{padding:'12px', borderRadius:'8px'}}><option value="income">➕ Ingreso</option><option value="expense">➖ Gasto</option></select>
          <input type="text" id="description" placeholder="Descripción" required style={{flex:1, padding:'12px', borderRadius:'8px', border:'1px solid #ddd'}} />
          <input type="number" id="amount" placeholder="0.00" required step="0.01" style={{padding:'12px', borderRadius:'8px', border:'1px solid #ddd', width:'130px'}} />
          <input type="date" id="dateInput" required style={{padding:'12px', borderRadius:'8px', border:'1px solid #ddd'}} />
          <select id="category" style={{padding:'12px', borderRadius:'8px'}}>
            <option value="Comida">🍔 Comida</option>
            <option value="Servicios">💡 Servicios</option>
            <option value="Transporte">🚗 Transporte</option>
            <option value="Salud">🏥 Salud</option>
            <option value="Otros">📦 Otros</option>
          </select>
          <button type="submit" style={{background:'#4f46e5', color:'white', border:'none', padding:'12px 25px', borderRadius:'8px'}}>Agregar Movimiento</button>
        </form>
      </div>
      <script src="https://cdn.jsdelivr.net/npm/chart.js" defer></script>
    </>
  );
}