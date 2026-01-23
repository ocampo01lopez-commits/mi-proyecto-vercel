"use client";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    require("./app_script.js");
  }, []);

  return (
    <>
      {/* PANTALLA DE LOGIN */}
      <div id="login-screen" className="auth-overlay">
        <div className="auth-card">
          <h2>🔐 Acceso Finanzas PRO</h2>
          <form id="loginForm">
            <input type="text" id="loginUser" placeholder="Usuario" required />
            <input type="password" id="loginPass" placeholder="Contraseña" required />
            <button type="submit">Entrar</button>
          </form>
          <p id="loginError" className="error-msg"></p>
        </div>
      </div>

      {/* MODAL DE CAMBIO DE CLAVE PERSONAL */}
      <div id="password-modal" className="auth-overlay" style={{ display: 'none' }}>
        <div className="auth-card">
          <h2>🆕 Nueva Contraseña</h2>
          <p>Crea una clave personal para tu cuenta. Se notificará a Josue.</p>
          <form id="changePassForm">
            <input type="password" id="newPass" placeholder="Nueva contraseña" required minLength={3} />
            <input type="password" id="confirmPass" placeholder="Confirmar contraseña" required minLength={3} />
            <button type="submit">Guardar y Notificar</button>
          </form>
          <p id="passError" className="error-msg"></p>
        </div>
      </div>

      {/* DASHBOARD PRINCIPAL CON TU DISEÑO */}
      <div id="app-content" style={{ display: 'none' }}>
        <header className="main-header">
          <div className="header-left">
            <div className="logo-section">
              <span className="logo-icon">💰</span>
              <h1>Finanzas PRO</h1>
            </div>
            <p className="welcome-text">Bienvenido, <span id="userNameDisplay"></span></p>
          </div>
          <div className="header-right">
            <div className="search-container">
              <input type="search" id="searchInput" placeholder="🔍 Buscar movimiento..." />
            </div>
            <button id="logoutBtn" className="btn-salir">🚪 Salir</button>
          </div>
        </header>

        <main className="dashboard-container">
          <section className="dashboard-cards">
            <div className="card income"><h3>Ingresos</h3><p id="totalIncome">L 0.00</p></div>
            <div className="card expense"><h3>Gastos</h3><p id="totalExpense">L 0.00</p></div>
            <div className="card balance"><h3>Balance Total</h3><p id="totalSavings">L 0.00</p></div>
          </section>

          <section className="charts-grid">
            <div className="chart-box">
              <h4>Distribución de Gastos</h4>
              <canvas id="categoryChart"></canvas>
            </div>
            <div className="chart-box">
              <h4>Ingresos vs Gastos</h4>
              <canvas id="trendChart"></canvas>
            </div>
          </section>

          {/* PANEL MAESTRO SECRETO (SOLO PARA JOSUE) */}
          <section id="manager-panel" style={{ display: 'none', margin: '25px 0' }}>
            <div className="panel-maestro">
              <h3>🔑 Panel Maestro de Recuperación</h3>
              <div className="table-container">
                <table className="mini-table">
                  <thead>
                    <tr><th>Usuario</th><th>Clave Actual</th><th>Estado</th></tr>
                  </thead>
                  <tbody id="passwords-table-body"></tbody>
                </table>
              </div>
            </div>
          </section>

          {/* FORMULARIO DE ENTRADA */}
          <section className="form-container">
            <form id="transactionForm" className="horizontal-form">
              <select id="type">
                <option value="income">➕ Ingreso</option>
                <option value="expense">➖ Gasto</option>
              </select>
              <input type="text" id="description" placeholder="Descripción" required />
              <input type="number" id="amount" placeholder="0.00" required step="0.01" />
              <input type="date" id="dateInput" required />
              <select id="category">
                <option value="Comida">🍔 Comida</option>
                <option value="Servicios">💡 Servicios</option>
                <option value="Transporte">🚗 Transporte</option>
                <option value="Salud">🏥 Salud</option>
                <option value="Otros">📦 Otros</option>
              </select>
              <button type="submit" id="submitBtn">Agregar Movimiento</button>
            </form>
          </section>

          <section className="history-container">
            <table id="transactionTable" className="main-table">
              <thead>
                <tr><th>Fecha</th><th>Detalle</th><th>Categoría</th><th>Monto</th><th>Acciones</th></tr>
              </thead>
              <tbody></tbody>
            </table>
          </section>
        </main>
      </div>
      <script src="https://cdn.jsdelivr.net/npm/chart.js" defer></script>
    </>
  );
}