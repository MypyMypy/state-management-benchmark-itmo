import React from "react";

export interface StreamControlsProps {
  rate: number;
  visible: number;
  running: boolean;
  onRateChange: (n: number) => void;
  onVisibleChange: (n: number) => void;
  onToggleRunning: () => void;
  hideVisible?: boolean;
}

export const StreamControls: React.FC<StreamControlsProps> = ({
  rate,
  visible,
  running,
  onRateChange,
  onVisibleChange,
  onToggleRunning,
  hideVisible,
}) => {
  return (
    <div
      style={{
        display: "flex",
        gap: 12,
        flexWrap: "wrap",
        alignItems: "center",
      }}
    >
      <button onClick={onToggleRunning}>
        {running ? "Остановить" : "Запустить"}
      </button>
      <label>
        Обновлений в секунду
        <input
          type="number"
          value={rate}
          onChange={(e) => onRateChange(Number(e.target.value))}
          style={{ marginLeft: 6 }}
        />
      </label>
      {!hideVisible && (
        <label>
          Количество отображаемых карточек
          <input
            type="number"
            value={visible}
            onChange={(e) => onVisibleChange(Math.max(1, Number(e.target.value)))}
            style={{ marginLeft: 6 }}
          />
        </label>
      )}
      {/* Кнопка дублировалась; оставляем одну русифицированную выше */}
    </div>
  );
};

export default StreamControls;
