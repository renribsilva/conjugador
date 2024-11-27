import { useState } from "react";

export function InfoPopup(): JSX.Element {
  const [isOpen, setIsOpen] = useState(false);

  const togglePopup = () => setIsOpen(!isOpen);

  return (
    <div className="info-popup-container">
      <button className="info-icon" onClick={togglePopup}>
        i
      </button>
      {isOpen && (
        <div className="popup-box">
          <p>Aqui está o texto da sua janela flutuante!</p>
        </div>
      )}
    </div>
  );
}
