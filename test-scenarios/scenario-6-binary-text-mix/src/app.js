import logo from '../assets/logo.png';

function App() {
  return (
    <div className="app">
      <img src={logo} alt="Logo" />
      <h1>Welcome to our app!</h1> {/* CHANGED: was "Welcome!" */}
      <p>This is a demo application.</p>
    </div>
  );
}

export default App;