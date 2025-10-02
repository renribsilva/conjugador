import styles from "../styles/index.module.css"

export default function ProgressBar ({ progress }: { progress: number }) {
  return (
    <div className={styles.progress_bar}>
      {progress !== 100 && (
        <div
          style={{
            width: `${progress}%`,
            background: 'var(--foreground)',
            height: '1.5px',
            transition: 'width 0.3s ease-in-out',
            borderRadius: '2rem',
          }}
        />
      )}
    </div>
  );
};