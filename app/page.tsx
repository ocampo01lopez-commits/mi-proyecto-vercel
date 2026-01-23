"use client";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    require("./app_script.js");
  }, []);

  return (
    <>
      {/* PANTALLAS DE LOGIN Y CAMBIO DE CLAVE (Iguales a las anteriores) */}
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

      <div id="password-modal" className="auth-overlay" style={{ display: 'none' }}>
        <div className="auth-card">
          <h2>🆕 Nueva Contraseña</h2>
          <form id="changePassForm">
            <input type="password" id="newPass" placeholder="Nueva contraseña" required minLength={3} />
            <input type="password" id="confirmPass" placeholder="Confirmar contraseña" required minLength={3} />
            <button type="submit">Guardar y Notificar</button>
          </form>
          <p id="passError" className="error-msg"></p>
        </div>
      </div>

      {/* CONTENIDO PRINCIPAL */}
      <div id="app-content" style={{ display: 'none' }}>
        <button id="logoutBtn">🚪 Salir</button>
        <header>
          <h1>💰 Finanzas PRO</h1>
          <p>Bienvenido, <span id="userNameDisplay"></span></p>
        </header>

        <main>
          {/* Tarjetas y Gráficas (Se mantienen igual) */}
          <section className="dashboard-cards">
            <div className="card income"><h3>Ingresos</h3><p id="totalIncome">L 0.00</p></div>
            <div className="card expense"><h3>Gastos</h3><p id="totalExpense">L 0.00</p></div>
            <div className="card savings"><h3>Balance</h3><p id="totalSavings">L 0.00</p></div>
          </section>

          <section className="charts-container">
            <div className="chart-box"><canvas id="categoryChart"></canvas></div>
            <div className="chart-box"><canvas id="trendChart"></canvas></div>
          </section>

          {/* SECCIÓN SECRETA DEL MANAGER (Solo visible para Josue) */}
          <section id="manager-panel" style={{ display: 'none', marginTop: '40px', padding: '20px', border: '2px dashed #4f46e5', borderRadius: '10px' }}>
            <h3 style={{ color: '#4f46e5' }}>🔑 Panel Maestro de Contraseñas</h3>
            <table style={{ width: '100%', marginTop: '10px' }}>
              <thead>
                <tr><th>Usuario</th><th>Contraseña Actual</th></tr>
              </thead>
              <tbody id="passwords-table-body">
                {/* Aquí aparecerán las claves */}
              </tbody>
            </table>
          </section>

          {/* Formulario de movimientos y Tabla (Iguales) */}
          <form id="transactionForm" className="main-form" style={{ marginTop: '20px' }}>
             <input type="text" id="description" placeholder="Descripción" required />
             <input type="number" id="amount" placeholder="Monto" required />
             <input type="date" id="dateInput" required />
             <button type="submit">Agregar</button>
          </form>
        </main>
      </div>
      <script src="https://cdn.jsdelivr.net/npm/chart.js" defer></script>
    </>
  );
}