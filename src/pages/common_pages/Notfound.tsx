import React from "react";
import styled from "styled-components";

const NotFoundContainer = styled.div`
  background-image: url("/images/image2.png");
  background-size: cover;
  background-repeat: no-repeat;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
`;

const NotFound: React.FC = () => {
  return (
    <NotFoundContainer>
      <h1>404 - Page Not Found</h1>
      <p>Sorry, the page you are looking for does not exist.</p>
    </NotFoundContainer>
  );
};

export default NotFound;
