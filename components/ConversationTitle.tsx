import React from 'react';
import { safeRender } from '../services/utils/safeRender.ts';

interface ConversationTitleProps {
    title: string;
}

export const ConversationTitle: React.FC<ConversationTitleProps> = ({ title }) => {
    return (
        <>
            <style>{`
                /* From Uiverse.io by 00Kubi, adapted for Monica */ 
                .ConversationTitle .container {
                  position: relative;
                  width: 290px;
                  height: 40px; /* Explicit height */
                  transition: 200ms;
                }

                .ConversationTitle #card {
                  position: absolute;
                  inset: 0;
                  z-index: 0;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  border-radius: 20px;
                  transition: 700ms;
                  background: linear-gradient(45deg, #1a1a1a, #262626);
                  border: 1px solid rgba(255, 255, 255, 0.1);
                  overflow: hidden;
                  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3), inset 0 0 10px rgba(0, 0, 0, 0.2);
                }

                .ConversationTitle .card-content {
                  position: relative;
                  width: 100%;
                  height: 100%;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                }
                
                .ConversationTitle .subtitle {
                  width: 100%;
                  text-align: center;
                  font-size: 14px;
                  letter-spacing: 1px;
                  color: rgba(255, 255, 255, 0.6);
                  padding: 0 1rem;
                  white-space: nowrap;
                  overflow: hidden;
                  text-overflow: ellipsis;
                }

                .ConversationTitle .highlight {
                  color: #00ffaa;
                  margin-left: 5px;
                  background: linear-gradient(90deg, #5c67ff, #ad51ff);
                  -webkit-background-clip: text;
                  -webkit-text-fill-color: transparent;
                  font-weight: bold;
                }

                .ConversationTitle .canvas {
                  perspective: 800px;
                  inset: 0;
                  z-index: 200;
                  position: absolute;
                  display: grid;
                  grid-template-columns: repeat(9, 1fr);
                  grid-template-rows: 1fr;
                }

                .ConversationTitle .tracker {
                  position: absolute;
                  z-index: 200;
                  width: 100%;
                  height: 100%;
                  grid-row: 1 / 2;
                }

                .ConversationTitle .tracker:hover { cursor: pointer; }
                .ConversationTitle .tracker:hover ~ #card { transition: 300ms; filter: brightness(1.2); }
                
                .ConversationTitle .tr-1 { grid-column: 1 / 2; }
                .ConversationTitle .tr-2 { grid-column: 2 / 3; }
                .ConversationTitle .tr-3 { grid-column: 3 / 4; }
                .ConversationTitle .tr-4 { grid-column: 4 / 5; }
                .ConversationTitle .tr-5 { grid-column: 5 / 6; }
                .ConversationTitle .tr-6 { grid-column: 6 / 7; }
                .ConversationTitle .tr-7 { grid-column: 7 / 8; }
                .ConversationTitle .tr-8 { grid-column: 8 / 9; }
                .ConversationTitle .tr-9 { grid-column: 9 / 10; }

                .ConversationTitle .tr-1:hover ~ #card { transition: 125ms ease-in-out; transform: rotateY(-8deg) rotateX(4deg); }
                .ConversationTitle .tr-2:hover ~ #card { transition: 125ms ease-in-out; transform: rotateY(-6deg) rotateX(4deg); }
                .ConversationTitle .tr-3:hover ~ #card { transition: 125ms ease-in-out; transform: rotateY(-4deg) rotateX(4deg); }
                .ConversationTitle .tr-4:hover ~ #card { transition: 125ms ease-in-out; transform: rotateY(-2deg) rotateX(4deg); }
                .ConversationTitle .tr-5:hover ~ #card { transition: 125ms ease-in-out; transform: rotateY(0deg)  rotateX(4deg); }
                .ConversationTitle .tr-6:hover ~ #card { transition: 125ms ease-in-out; transform: rotateY(2deg)  rotateX(4deg); }
                .ConversationTitle .tr-7:hover ~ #card { transition: 125ms ease-in-out; transform: rotateY(4deg)  rotateX(4deg); }
                .ConversationTitle .tr-8:hover ~ #card { transition: 125ms ease-in-out; transform: rotateY(6deg)  rotateX(4deg); }
                .ConversationTitle .tr-9:hover ~ #card { transition: 125ms ease-in-out; transform: rotateY(8deg)  rotateX(4deg); }

                .ConversationTitle .noselect { -webkit-user-select: none; user-select: none; }

                .ConversationTitle .card-glare {
                  position: absolute; inset: 0;
                  background: linear-gradient(125deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.05) 45%, rgba(255, 255, 255, 0.1) 50%, rgba(255, 255, 255, 0.05) 55%, rgba(255, 255, 255, 0) 100%);
                  opacity: 0; transition: opacity 300ms;
                }
                .ConversationTitle #card:hover .card-glare { opacity: 1; }

                .ConversationTitle .cyber-lines span {
                  position: absolute;
                  background: linear-gradient(90deg, transparent, rgba(92, 103, 255, 0.2), transparent);
                  animation: lineGrow 3s linear infinite;
                }
                .ConversationTitle .cyber-lines span:nth-child(1) { top: 20%; left: 0; width: 100%; height: 1px; transform-origin: left; animation-delay: 0s; }
                .ConversationTitle .cyber-lines span:nth-child(2) { top: 80%; right: 0; width: 100%; height: 1px; transform-origin: right; animation-delay: 1.5s; }

                .ConversationTitle .corner-elements span {
                  position: absolute; width: 15px; height: 15px; border: 2px solid rgba(92, 103, 255, 0.3); transition: all 0.3s ease;
                }
                .ConversationTitle #card:hover .corner-elements span { border-color: rgba(92, 103, 255, 0.8); box-shadow: 0 0 10px rgba(92, 103, 255, 0.5); }
                .ConversationTitle .corner-elements span:nth-child(1) { top: 10px; left: 10px; border-right: 0; border-bottom: 0; }
                .ConversationTitle .corner-elements span:nth-child(2) { top: 10px; right: 10px; border-left: 0; border-bottom: 0; }
                .ConversationTitle .corner-elements span:nth-child(3) { bottom: 10px; left: 10px; border-right: 0; border-top: 0; }
                .ConversationTitle .corner-elements span:nth-child(4) { bottom: 10px; right: 10px; border-left: 0; border-top: 0; }

                .ConversationTitle .scan-line {
                  position: absolute; inset: 0;
                  background: linear-gradient(to bottom, transparent, rgba(92, 103, 255, 0.1), transparent);
                  transform: translateY(-100%); animation: scanMove 2s linear infinite;
                }

                @keyframes lineGrow { 0%, 100% { transform: scaleX(0); opacity: 0; } 50% { transform: scaleX(1); opacity: 1; } }
                @keyframes scanMove { 0% { transform: translateY(-100%); } 100% { transform: translateY(100%); } }
            `}</style>
            <div className="ConversationTitle">
              <div className="container noselect">
                <div className="canvas">
                  <div className="tracker tr-1"></div>
                  <div className="tracker tr-2"></div>
                  <div className="tracker tr-3"></div>
                  <div className="tracker tr-4"></div>
                  <div className="tracker tr-5"></div>
                  <div className="tracker tr-6"></div>
                  <div className="tracker tr-7"></div>
                  <div className="tracker tr-8"></div>
                  <div className="tracker tr-9"></div>
                </div>
                <div id="card">
                  <div className="card-content">
                    <div className="card-glare"></div>
                    <div className="cyber-lines"><span></span><span></span></div>
                    <div className="subtitle">
                      <span className="highlight">{safeRender(title)}</span>
                    </div>
                    <div className="corner-elements"><span></span><span></span><span></span><span></span></div>
                    <div className="scan-line"></div>
                  </div>
                </div>
              </div>
            </div>
        </>
    );
};