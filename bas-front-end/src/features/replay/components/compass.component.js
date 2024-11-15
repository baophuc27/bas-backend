import styles from "./../pages/dock.style.module.css";

export const Compass = ({ direction }) => {
  return (
    <div
      className={styles.compass}
      style={{ transform: `rotate(${direction}deg)` }}
    >
      <strong
        className={styles.compassText}
        style={{
          top: 0,
          left: "50%",
          transform: `translateX(-50%) rotate(${-direction}deg)`,
        }}
      >
        N
      </strong>
      <strong
        className={styles.compassText}
        style={{
          position: "absolute",
          top: "50%",
          right: 0,
          transform: `translateY(-50%) rotate(${-direction}deg)`,
        }}
      >
        E
      </strong>
      <strong
        className={styles.compassText}
        style={{
          position: "absolute",
          bottom: 0,
          left: "50%",
          transform: `translateX(-50%) rotate(${-direction}deg)`,
        }}
      >
        S
      </strong>
      <strong
        className={styles.compassText}
        style={{
          position: "absolute",
          top: "50%",
          left: 0,
          transform: `translateY(-55%) rotate(${-direction}deg)`,
        }}
      >
        W
      </strong>
      <img
        src="/images/compass.png"
        alt="Compass"
        className={styles.compassImg}
      />
    </div>
  );
};
