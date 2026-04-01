# Curelex Admin Portal

The Curelex Admin Portal is a health-tech platform designed for administrators to manage doctors, patients, revenue, and system analytics. It consists of a reliable **Node.js** backend API connecting to a **MySQL** database, paired with a dynamic static HTML/JS frontend.

## 📂 Project Structure

- `Backend/`: The Node.js and Express backend API and database schemas.
- `Frontend/`: The JavaScript and HTML files that serve the Admin Portal UI.

## ⚙️ Prerequisites

Before you begin, ensure you have the following installed on your machine:
- **Node.js** (v14 or higher is recommended)
- **MySQL Server**

---

## 🚀 Backend Setup

The backend handles API requests, database interactions, and business logic.

1. **Navigate to the Backend directory:**
   ```bash
   cd Backend
   ```

2. **Install all required dependencies:**
   ```bash
   npm install
   ```

3. **Configure the Database:**
   - **Step 1:** Run `node create_db.js` to automatically create the empty `curelexDb` database or create the datbase manually using Mysql Workbench.
   - **Step 2:** Run `node seed_runner.js` to securely connect to the database, generate all tables from `schema.sql`, and securely populate them with dummy data from `seed.sql`! OR run this both files(`schema.sql` and `seed.sql`) content manually on Mysql Workbench

4. **Add your Environment Variables:**
   - Copy the `.env.example` file and rename it to `.env`:
     ```bash
     cp .env.example .env
     ```
   - Open `.env` and fill in your actual MySQL database credentials (`DB_USER` and `DB_PASSWORD`). The default is set to `localhost` and `root` with no password.

5. **Start the API Server:**
   - To run the server in development mode (which restarts automatically if you change a file):
     ```bash
     npm run dev
     ```
   - To start it normally:
     ```bash
     npm start
     ```
   *The backend should now be running on `http://localhost:5000`.*

---

## 🖥️ Frontend Setup

The frontend connects directly to the backend API you just started.

1. **Navigate to the Frontend directory:**
   ```bash
   cd Frontend
   ```

2. **Run the Frontend Application:**
   Because the frontend fetches data from the API, it is highly recommended to serve the files using a local development server to avoid CORS issues.

   **Option A: Using Node's `serve` package (Recommended)**:
   ```bash
   npx serve .
   ```

   **Option B: Using a VS Code Extension**:
   - Install the **Live Server** extension in VS Code.
   - Right-click on `index.html` or `login.html` and select **"Open with Live Server"**.

   **Option C: Direct Local Access**:
   - In some browsers, you can simply double-click and open `login.html` directly from your file explorer. Just make sure the Backend is explicitly running on port 5000.

3. **Log In:**
   - Open the app in your browser and use an admin token or login credentials to access the Dashboard.
