import { Portal } from "solid-js/web";
import styles from "./Dashboard.module.css";
const Dashboard = () => {
  return (
    <Portal>
      <main class="mainHomePage currentActivePage">
        <header style={{ position: "relative" }}>
          <div>
            <h1>Dashboard</h1>
          </div>
          <div class="buttonContainer">
            <button>{}</button>
          </div>
        </header>

        <div class={styles.tableContainer} id="demoDW">
          <table class={styles.tableStyle}>
            <thead>
              <tr>
                <th>Head</th>
                <th>Head</th>
                <th>Head</th>
                <th>Head</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th>Head</th>
                <td>Cell</td>
                <td>Cell</td>
                <td>Cell</td>
              </tr>
              <tr>
                <th>Head</th>
                <td>Cell</td>
                <td>Cell</td>
                <td>Cell</td>
              </tr>
              <tr>
                <th>Head</th>
                <td>Cell</td>
                <td>Cell</td>
                <td>Cell</td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>
    </Portal>
  );
};

export default Dashboard;
