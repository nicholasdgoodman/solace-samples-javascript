import { useState } from 'react';
import { useTopicSubscription } from '../context/SolaceContext';

export default function Subscriber() {
  const [count, setCount] = useState(0);
  const [message, setMessage] = useState('');
  
  useTopicSubscription('try-me', msg => {
    setMessage(msg.getBinaryAttachment().toString());
    setCount(c => c + 1);
  });
  
  return (
    <div className="card">
    <p>
      Received message: {message}
    </p>
    <p>
      Count: <strong>{count}</strong>
    </p>
  </div>
  );
}