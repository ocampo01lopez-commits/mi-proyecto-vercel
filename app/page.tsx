"use client";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    // Esto asegura que el JS se ejecute solo en el cliente
    require("./app_script.js");
  }, []);

  return (
    <>
      <div id="toast-container"></div>
      <button id="toggleTheme" title="Cambiar tema">🌙</button>

      <header>
        <div className="header-content">
          <h1>💰 Finanzas PRO</h1>
          <p className="subtitle">Control total de tu dinero</p>
        </div>
        <input type="search" id="searchInput" placeholder="🔍 Buscar movimiento..." />
      </header>

      <main>
        <section className="dashboard-cards">
          <div className="card income">
            <h3>Ingresos</h3>
            <p id="totalIncome">L 0.00</p>
          </div>
          <div className="card expense">
            <h3>Gastos</h3>
            <p id="totalExpense">L 0.00</p>
          </div>
          <div className="card savings">
            <h3>Balance Total</h3>
            <p id="totalSavings">L 0.00</p>
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
              <input type="text" id="description" placeholder="Ej: Sueldo..." required minLength={3} />
            </div>
            <div className="form-group">
              <label>Monto</label>
              <input type="number" id="amount" placeholder="0.00" required step="0.01" min="0.01" />
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
                <option value="Casa">🏠 Casa</option>
                <option value="Otros">📦 Otros</option>
              </select>
            </div>
            <button type="submit" id="submitBtn">Agregar Movimiento</button>
            <button type="button" id="cancelEditBtn" className="cancel-btn" hidden>Cancelar</button>
          </form>
        </section>

        <section className="charts-container">
          <div className="chart-box">
            <h4>Distribución de Gastos</h4>
            <div className="canvas-wrapper"><canvas id="categoryChart"></canvas></div>
          </div>
          <div className="chart-box">
            <h4>Evolución del Balance</h4>
            <div className="canvas-wrapper"><canvas id="trendChart"></canvas></div>
          </div>
        </section>

        <section className="history-section">
          <div className="table-header">
            <h2>Historial Reciente</h2>
            <button id="exportBtn" className="secondary-btn">⬇ Exportar CSV</button>
          </div>
          <div className="table-responsive">
            <table id="transactionTable">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Descripción</th>
                  <th>Categoría</th>
                  <th>Monto</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody></tbody>
            </table>
          </div>
        </section>
      </main>
      
      {/* Script externo para Chart.js */}
      <script src="https://cdn.jsdelivr.net/npm/chart.js" defer></script>
    </>
  );
}