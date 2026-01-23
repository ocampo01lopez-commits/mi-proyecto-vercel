"use client";
import { useEffect } from "react";
import "./globals.css";

export default function Home() {
  useEffect(() => {
    require("./app_script.js");
  }, []);

  return (
    <>
      {/* PANTALLA DE LOGIN OSCURECIDA */}
      <div id="login-screen" className="auth-overlay">
        <div className="auth-card">
          <h2>🔐 Acceso Finanzas PRO</h2>
          <form id="loginForm">
            <input type="text" id="loginUser" placeholder="Usuario" required style={{width:'100%', padding:'10px', marginBottom:'10px'}} />
            <input type="password" id="loginPass" placeholder="Contraseña" required style={{width:'100%', padding:'10px', marginBottom:'10px'}} />
            <button type="submit" style={{width:'100%', padding:'10px', background:'#4f46e5', color:'white', border:'none', borderRadius:'5px', cursor:'pointer'}}>Entrar</button>
          </form>
          <p id="loginError" style={{color:'red', marginTop:'10px'}}></p>
        </div>
      </div>

      {/* PANTALLA DE NUEVA CLAVE OSCURECIDA */}
      <div id="password-modal" className="auth-overlay" style={{ display: 'none' }}>
        <div className="auth-card">
          <h2>🆕 Nueva Contraseña</h2>
          <p style={{fontSize:'14px', color:'#64748b'}}>Por seguridad, crea tu clave personal.</p>
          <form id="changePassForm">
            <input type="password" id="newPass" placeholder="Nueva clave" required style={{width:'100%', padding:'10px', marginBottom:'10px'}} />
            <input type="password" id="confirmPass" placeholder="Confirmar clave" required style={{width:'100%', padding:'10px', marginBottom:'10px'}} />
            <button type="submit" style={{width:'100%', padding:'10px', background:'#10b981', color:'white', border:'none', borderRadius:'5px', cursor:'pointer'}}>Actualizar Clave</button>
          </form>
        </div>
      </div>

      {/* CONTENIDO PRINCIPAL */}
      <div id="app-content" className="main-app" style={{ display: 'none' }}>
        <header style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'30px'}}>
          <h1>💰 Finanzas PRO <small style={{fontSize:'14px', color:'#64748b'}}>| Bienvenido, <span id="userNameDisplay"></span></small></h1>
          <div style={{display:'flex', gap:'10px'}}>
            <input type="search" id="searchInput" placeholder="🔍 Buscar movimiento..." style={{padding:'10px', borderRadius:'10px', border:'1px solid #ddd', width:'250px'}} />
            <button id="logoutBtn" style={{background:'#ef4444', color:'white', border:'none', padding:'10px 20px', borderRadius:'10px', cursor:'pointer', fontWeight:'bold'}}>🧧 Salir</button>
          </div>
        </header>

        <section className="summary-grid">
          <div className="card-summary income"><h3>Ingresos</h3><p id="totalIncome" style={{fontSize:'28px', fontWeight:'bold'}}>L 0.00</p></div>
          <div className="card-summary expense"><h3>Gastos</h3><p id="totalExpense" style={{fontSize:'28px', fontWeight:'bold'}}>L 0.00</p></div>
          <div className="card-summary balance"><h3>Balance Total</h3><p id="totalSavings" style={{fontSize:'28px', fontWeight:'bold'}}>L 0.00</p></div>
        </section>

        {/* HISTORIAL DE MOVIMIENTOS */}
        <div className="table-container">
          <h3 style={{margin:0}}>🗒️ Historial de Movimientos</h3>
          <table className="data-table">
            <thead>
              <tr><th>Fecha</th><th>Descripción</th><th>Categoría</th><th>Monto</th></tr>
            </thead>
            <tbody id="history-body"></tbody>
          </table>
        </div>

        {/* PANEL MAESTRO (SOLO JOSUE) */}
        <div id="manager-panel" className="table-container" style={{ display: 'none', border:'1px solid #f59e0b' }}>
          <h3 style={{color:'#f59e0b', margin:0}}>🔑 Panel Maestro de Recuperación</h3>
          <table className="data-table">
            <thead>
              <tr><th>Usuario</th><th>Clave Actual</th><th>Estado</th></tr>
            </thead>
            <tbody id="passwords-table-body"></tbody>
          </table>
        </div>

        {/* FORMULARIO */}
        <form id="transactionForm" style={{background:'white', padding:'20px', borderRadius:'15px', display:'flex', gap:'10px', alignItems:'center', boxShadow:'0 4px 6px rgba(0,0,0,0.05)'}}>
          <select id="type" style={{padding:'10px', borderRadius:'8px'}}><option value="income">➕ Ingreso</option><option value="expense">➖ Gasto</option></select>
          <input type="text" id="description" placeholder="Descripción" required style={{flex:1, padding:'10px', borderRadius:'8px', border:'1px solid #ddd'}} />
          <input type="number" id="amount" placeholder="0.00" required step="0.01" style={{width:'120px', padding:'10px', borderRadius:'8px', border:'1px solid #ddd'}} />
          <input type="date" id="dateInput" required style={{padding:'10px', borderRadius:'8px', border:'1px solid #ddd'}} />
          <select id="category" style={{padding:'10px', borderRadius:'8px'}}>
            <option value="Comida">🍔 Comida</option>
            <option value="Servicios">💡 Servicios</option>
            <option value="Transporte">🚗 Transporte</option>
            <option value="Salud">🏥 Salud</option>
            <option value="Otros">📦 Otros</option>
          </select>
          <button type="submit" style={{background:'#4f46e5', color:'white', border:'none', padding:'10px 20px', borderRadius:'8px', fontWeight:'bold', cursor:'pointer'}}>Agregar Movimiento</button>
        </form>
      </div>
    </>
  );
}