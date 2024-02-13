import { useState } from 'react';

import { useTopicPublisher } from '../context/SolaceContext';

export default function Publisher() {
  const [message, setMessage] = useState('Hello, World!');
  const publisher = useTopicPublisher();

  return (
    <div className="card">
      <p><input value={message} onInput={e => setMessage(e.target.value)}></input></p>
      <button onClick={() => publisher?.publish(message, 'try-me')} disabled={publisher == null}>
        Publish Message
      </button>
    </div>
  );
}