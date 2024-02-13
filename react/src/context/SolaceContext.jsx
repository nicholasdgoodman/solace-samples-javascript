import { createContext, useContext, useEffect, useState } from "react";
import solace from "solclientjs";

const SolaceSessionContext = createContext();

solace.SolclientFactory.init(Object.assign(
  new solace.SolclientFactoryProperties(),
  { profile: solace.SolclientFactoryProfiles.version10_5 }
));

export function SolaceSessionProvider({ options, children }) {
  const factory = solace.SolclientFactory;
  const { createSession } = factory;

  const [session, setSession] = useState();
  useEffect(() => {
    if(!options) {
      return;
    }
    const newSession = createSession(options);
    
    const onConnect = () => {
      setSession(newSession);
    };

    newSession.on(solace.SessionEventCode.UP_NOTICE, onConnect);
    newSession.connect();

    return () => {
      newSession.removeAllListeners();
    };
  }, [options]);


  return (
    <SolaceSessionContext.Provider value={session}>
      {children}
    </SolaceSessionContext.Provider>
  );
}

export function useSolaceSession() {
  return useContext(SolaceSessionContext);
}

export function useTopicPublisher() {
  const session = useSolaceSession();
  return session ? ({
    publish: (payload, topic) => {
      const message = solace.SolclientFactory.createMessage();
      const destination = solace.SolclientFactory.createTopicDestination(topic);
      message.setDestination(destination);
      message.setBinaryAttachment(payload);
      message.setDeliveryMode(solace.MessageDeliveryModeType.DIRECT);
      session.send(message);
    }
  }) : null;
}

export function useTopicSubscription(topic, onMessage) {
  const session = useSolaceSession();

  useEffect(() => {
    if(!session) {
      return;
    }
    session.on(solace.SessionEventCode.MESSAGE, onMessage); //TODO: topic dispatch

    const destination = solace.SolclientFactory.createTopicDestination(topic);
    session.subscribe(destination, false);

    return () => {
      if(!session) {
        return;
      }
      session.removeListener(solace.SessionEventCode.MESSAGE, onMessage);
      session.unsubscribe(destination, false);
    };
  }, [session]);
}