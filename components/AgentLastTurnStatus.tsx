import React from 'react';
import styled from 'styled-components';

interface AgentLastTurnStatusProps {
  wasUsed: boolean;
}

const AgentLastTurnStatus: React.FC<AgentLastTurnStatusProps> = ({ wasUsed }) => {
  return (
    <StyledWrapper>
      <div className="toggle-cont">
        <input className="toggle-input" id="toggle" name="toggle" type="checkbox" checked={wasUsed} readOnly />
        <label className="toggle-label" htmlFor="toggle">
          <div className="cont-label-play">
            <span className="label-play" />
          </div>
        </label>
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .toggle-cont {
    width: 100px;
    height: 50px;
    border-radius: 9999px;
  }

  .toggle-cont .toggle-label {
    cursor: pointer;
    position: relative;
    display: inline-block;
    padding: 6px;
    width: 100%;
    height: 100%;
    background: #272727;
    border-radius: 9999px;
    box-sizing: content-box;
    box-shadow: 0px 0px 16px -8px #fefefe;
  }

  .toggle-cont .toggle-label .cont-label-play {
    position: relative;
    width: 50px;
    aspect-ratio: 1 / 1;
    background: #5e5e5e;
    border-radius: 9999px;
    transition: all 0.5s cubic-bezier(1, 0, 0, 1);
  }

  .toggle-cont .toggle-input:checked + .toggle-label .cont-label-play {
    background: #f43f5e;
    transform: translateX(50px);
  }

  .toggle-cont .toggle-label .label-play {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: inline-block;
    width: 24px;
    aspect-ratio: 1 / 1;
    background: #fefefe;
    border-radius: 4px;
    clip-path: polygon(25% 0, 75% 50%, 25% 100%, 25% 51%);
    transition: all 0.5s cubic-bezier(1, 0, 0, 1);
  }

  .toggle-cont .toggle-input:checked + .toggle-label .label-play {
    width: 20px;
    clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
  }
`;

export default AgentLastTurnStatus;