import React from 'react';

export const MonicaButton: React.FC = () => {
    return (
        <button type="button" className="btn">
          <strong>Monica</strong>
          <div id="container-stars">
            <div id="stars"></div>
          </div>

          <div id="glow">
            <div className="circle"></div>
            <div className="circle"></div>
          </div>
        </button>
    );
};
