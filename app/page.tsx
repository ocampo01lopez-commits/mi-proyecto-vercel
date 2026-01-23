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

      {/* MODAL CAMBIO DE CONTRASEÑA OBLIGATORIO */}
      <div id="password-modal" className="auth-overlay" style={{ display: 'none' }}>
        <div className="auth-card">
          <h2>🆕 Actualiza tu Contraseña</h2>
          <p>Por seguridad, debes cambiar tu contraseña inicial.</p>
          <form id="changePassForm">
            <input type="password" id="newPass" placeholder="Nueva contraseña" required minLength={3} />
            <input type="password" id="confirmPass" placeholder="Confirmar contraseña" required minLength={3} />
            <button type="submit">Guardar y Continuar</button>
          </form>
          <p id="passError" className="error-msg"></p>
        </div>
      </div>

      {/* CONTENIDO PRINCIPAL */}
      <div id="app-content" style={{ display: 'none' }}>
        <button id="toggleTheme" title="Cambiar tema">🌙</button>
        <button id="logoutBtn">🚪 Salir</button>

        <header>
          <div className="header-content">
            <h1>💰 Finanzas PRO</h1>
            <p className="subtitle">Bienvenido, <span id="userNameDisplay"></span></p>
          </div>
          <input type="search" id="searchInput" placeholder="🔍 Buscar movimiento..." />
        </header>

        <main>
          <section className="dashboard-cards">
            <div className="card income"><h3>Ingresos</h3><p id="totalIncome">L 0.00</p></div>
            <div className="card expense"><h3>Gastos</h3><p id="totalExpense">L 0.00</p></div>
            <div className="card savings"><h3>Balance Total</h3><p id="totalSavings">L 0.00</p></div>
          </section>

          <section className="charts-container">
            <div className="chart-box">
              <h4>Distribución de Gastos</h4>
              <div className="canvas-wrapper"><canvas id="categoryChart"></canvas></div>
            </div>
            <div className="chart-box">
              <h4>Ingresos vs Gastos</h4>
              <div className="canvas-wrapper"><canvas id="trendChart"></canvas></div>
            </div>
          </section>

          <section className="form-section">
            <form id="transactionForm" autoComplete="off">
              <div className="form-group">
                <label>Tipo</label>
                <select id="type">
                  <option value="income">➕ Ingreso</option>
                  <option value="expense">➖ Gasto</option>
                </select>
              </div>
              <div className="form-group">
                <label>Descripción</label>
                <input type="text" id="description" placeholder="Ej: Pago de renta" required />
              </div>
              <div className="form-group">
                <label>Monto</label>
                <input type="number" id="amount" placeholder="0.00" required step="0.01" />
              </div>
              <div className="form-group">
                <label>Fecha</label>
                <input type="date" id="dateInput" required />
              </div>
              <div className="form-group">
                <label>Categoría</label>
                <select id="category">
                  <option value="Ahorro">💰 Ahorro</option>
                  <option value="Comida">🍔 Comida</option>
                  <option value="Transporte">🚗 Transporte</option>
                  <option value="Servicios">💡 Servicios</option>
                  <option value="Entretenimiento">🎮 Ocio</option>
                  <option value="Salud">🏥 Salud</option>
                  <option value="Otros">📦 Otros</option>
                </select>
              </div>
              <button type="submit" id="submitBtn">Agregar Movimiento</button>
              <button type="button" id="cancelEditBtn" className="cancel-btn" hidden>Cancelar</button>
            </form>
          </section>

          <section className="history-section">
            <div className="table-responsive">
              <table id="transactionTable">
                <thead>
                  <tr><th>Fecha</th><th>Descripción</th><th>Categoría</th><th>Monto</th><th>Acciones</th></tr>
                </thead>
                <tbody></tbody>
              </table>
            </div>
          </section>
        </main>
      </div>
      
      <script src="https://cdn.jsdelivr.net/npm/chart.js" defer></script>
    </>
  );
}