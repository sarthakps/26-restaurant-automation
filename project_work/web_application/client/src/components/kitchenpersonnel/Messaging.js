import React from 'react'
import { Container, Row, Col, Spinner } from 'reactstrap';
const axios = require('axios');

export const Messaging = () => {
  const [messages, setMessages] = React.useState([]);
  const [requesting, setRequesting] = React.useState(false);

  React.useEffect(() => {
    setRequesting(true);
    axios.get("/messages").then((resp) => {
      setMessages(resp.data.messages);
      setRequesting(false);
    });
  }, []);

  return (
    <Container>
      {/* form goes here */}
      <div className="message-list">
        <h3>Messages</h3>
        {requesting ? (
          <Spinner animation="border" role="status">
            <span className="sr-only">Loading...</span>
          </Spinner>
        ) : (
          <>
            {messages.map((m, index) => {
              const { name, message } = m;
              return (
                <div key={index}>
                  {name}: {message}
                </div>
              );
            })}
          </>
        )}
      </div>
    </Container>
  );
};