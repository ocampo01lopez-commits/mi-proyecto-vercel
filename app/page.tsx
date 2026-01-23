"use client";
import { useEffect } from "react";
import "./globals.css";

export default function Home() {
  useEffect(() => { require("./app_script.js"); }, []);

  return (
    <>
      <div id="login-screen" className="lock-screen">
        <div style={{background:'white', padding:'40px', borderRadius:'20px', width:'320px', textAlign:'center'}}>
          <h2 style={{color:'#1e293b'}}>🔐 Acceso Finanzas</h2>
          <form id="loginForm">
            <input type="text" id="loginUser" placeholder="Usuario" required style={{width:'100%', padding:'10px', marginBottom:'10px'}} />
            <input type="password" id="loginPass" placeholder="Contraseña" required style={{width:'100%', padding:'10px', marginBottom:'20px'}} />
            <button type="submit" style={{width:'100%', padding:'12px', background:'#4f46e5', color:'white', border:'none', borderRadius:'8px', fontWeight:'bold'}}>Entrar</button>
          </form>
          <p id="loginError" style={{color:'red', marginTop:'10px'}}></p>
        </div>
      </div>

      <div id="app-content" className="app-wrapper" style={{ display: 'none' }}>
        <header className="app-header">
          <div>
            <h1>💰 Finanzas PRO</h1>
            <p>Bienvenido, <span id="userNameDisplay"></span></p>
          </div>
          <div style={{display:'flex', gap:'15px'}}>
            <button id="themeToggle" className="theme-btn">🌙</button>
            <button id="logoutBtn" style={{background:'#ef4444', color:'white', border:'none', padding:'10px 20px', borderRadius:'10px', fontWeight:'bold'}}>Salir</button>
          </div>
        </header>

        <div className="balance-grid">
          <div className="b-card in"><h3>Ingresos</h3><p id="totalIncome" style={{fontSize:'28px', fontWeight:'bold'}}>L 0.00</p></div>
          <div className="b-card ex"><h3>Gastos</h3><p id="totalExpense" style={{fontSize:'28px', fontWeight:'bold'}}>L 0.00</p></div>
          <div className="b-card ba"><h3>Balance Total</h3><p id="totalSavings" style={{fontSize:'28px', fontWeight:'bold'}}>L 0.00</p></div>
        </div>

        <div className="section-box">
          <h3>🗒️ Historial de Movimientos</h3>
          <table className="data-table">
            <thead><tr><th>Fecha</th><th>Descripción</th><th>Categoría</th><th>Monto</th></tr></thead>
            <tbody id="history-body"></tbody>
          </table>
        </div>

        {/* PANEL MAESTRO (PARA JOSUE) */}
        <div id="manager-panel" className="section-box" style={{ display: 'none', border:'2px solid #f59e0b' }}>
          <h3 style={{color:'#f59e0b'}}>🔑 Panel Maestro de Recuperación (Josue)</h3>
          <table className="data-table">
            <thead><tr><th>Usuario</th><th>Clave Actual</th><th>Estado</th></tr></thead>
            <tbody id="passwords-table-body"></tbody>
          </table>
        </div>

        {/* CAMBIO DE CONTRASEÑA (PARA USUARIOS) */}
        <div id="user-settings" className="section-box">
          <h3>🛡️ Seguridad de la cuenta</h3>
          <div className="change-pass-box">
            <input type="password" id="newPassInput" placeholder="Nueva contraseña" style={{padding:'10px', borderRadius:'5px', border:'1px solid #ddd', flex:1}} />
            <button id="changePassBtn" style={{background:'#10b981', color:'white', border:'none', padding:'10px 20px', borderRadius:'8px', cursor:'pointer'}}>Actualizar Clave</button>
          </div>
          <p id="passMsg" style={{fontSize:'12px', marginTop:'5px'}}></p>
        </div>

        <form id="transactionForm" className="entry-form">
          <select id="type"><option value="income">➕ Ingreso</option><option value="expense">➖ Gasto</option></select>
          <input type="text" id="description" placeholder="Descripción" required />
          <input type="number" id="amount" placeholder="0.00" step="0.01" required />
          <input type="date" id="dateInput" required />
          <select id="category">
            <option value="Comida">🍔 Comida</option><option value="Servicios">💡 Servicios</option>
            <option value="Transporte">🚗 Transporte</option><option value="Otros">📦 Otros</option>
          </select>
          <button type="submit" className="entry-btn">Agregar Movimiento</button>
        </form>
      </div>
    </>
  );
}