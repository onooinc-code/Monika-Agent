import React from 'react';
import styled from 'styled-components';

interface AgentOnOffSwitchProps {
  isOn: boolean;
  handleToggle: () => void;
}

const AgentOnOffSwitch: React.FC<AgentOnOffSwitchProps> = ({ isOn, handleToggle }) => {
  return (
    <StyledWrapper>
      <label className="switch">
        <input type="checkbox" checked={isOn} onChange={handleToggle} />
        <div className="slider">
          <div className="slider-btn">
            <div className="light" />
            <div className="texture" />
            <div className="texture" />
            <div className="texture" />
            <div className="light" />
          </div>
        </div>
      </label>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .switch {
    width: 100px;
    height: 45px;
  }

  .switch input {
    display: none;
  }

  .slider {
    cursor: pointer;
    position: relative;
    width: 100%;
    height: 100%;
    background-color: rgb(8, 8, 8);
    transition: all 0.4s cubic-bezier(0.99, 0.1, 0.1, 0.99);
    border-radius: 5px;
    box-shadow:
      inset 0px 0px 1px 0px rgba(0, 0, 0, 1),
      inset 90px 0px 50px -50px rgba(126, 4, 4, 0.56);
    border: 2px solid black;
  }

  .slider-btn {
    position: absolute;
    content: "";
    aspect-ratio: 6/4;
    border-radius: 3px;
    left: 2px;
    top: 2px;
    bottom: 2px;
    right: auto;
    background: linear-gradient(to bottom, #333333, #242323);
    border: 1px solid #2b2b2b;
    background-color: #333333;
    box-shadow:
      0px 10px 5px 1px rgba(0, 0, 0, 0.15),
      inset 10px 0px 10px -5px rgba(126, 4, 4, 0.1);;
    transition: all 0.4s cubic-bezier(0.99, 0.1, 0.1, 0.99);
    display: flex;
    align-items: center;
    justify-content: space-around;
  }

  .texture {
    width: 2px;
    height: 70%;
    background-color: #202020ea;
    box-shadow:
      -0.7px -1.5px 1px 0px rgba(192, 192, 192, 0.3),
      0px 2px 3px rgb(0, 0, 0, 0.3);
    transition: 0.25s;
  }

  .light {
    width: 4px;
    height: 4px;
    border: 1px solid #222121;
    border-radius: 50%;
    transition: all 0.4s cubic-bezier(0.99, 0.1, 0.1, 0.99);
    background-color: rgb(230, 14, 14);
    box-shadow: 0px 0px 10px 1px rgb(241, 28, 28);
  }

  .switch input:checked + .slider {
    box-shadow:
      inset 0px 0px 1px 0px rgba(0, 0, 0, 1),
      inset -85px 0px 50px -50px rgba(1, 78, 4, 0.6);
  }

  .switch input:checked + .slider .slider-btn {
    transform: translateX(66%);
    box-shadow:
      0px 10px 5px 1px rgba(0, 0, 0, 0.15),
      inset -10px 0px 10px -5px rgba(1, 112, 4, 0.1);
  }

  .switch input:checked + .slider .slider-btn .light {
    background-color: rgb(35, 158, 4);
    box-shadow: 0px 0px 10px 0px rgb(57, 230, 14);
  }
`;

export default AgentOnOffSwitch;
