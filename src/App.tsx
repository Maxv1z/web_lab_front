import AppRoutes from './routes';
import Navbar from './components/Navbar';

export default function App() {
  return (
    <>
      <Navbar />
      <div className="container">
        <AppRoutes />
      </div>
    </>
  );
}
