import { SolaceSessionProvider } from './context/SolaceContext';

import Logo from './components/Logo';
import Publisher from './components/Publisher';
import Subscriber from './components/Subscriber';

import './App.css';

const sessionOptions = {
  url: 'ws://broker-std.local:8008',
  vpnName: 'default',
  userName: 'client',
  password: 'password'
};

function App() {
  return (
    <SolaceSessionProvider options={sessionOptions}>
      <Logo />
      <Publisher />
      <Subscriber />
    </SolaceSessionProvider>
  );
}

export default App
