import { useEffect, useState } from "react";
import styles from "../../styles/components.module.css";
import Safari from "../svgs/safari";

const InstallButton = () => {

  const [deferredPrompt, setDeferredPrompt] = useState<Event | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () =>
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      (deferredPrompt as any).prompt();
      const { outcome } = await (deferredPrompt as any).userChoice;
      setDeferredPrompt(null);
      setIsInstallable(false);
      console.log(`User response to the install prompt: ${outcome}`);
    }
  };

  return (
    <>
      {isInstallable && (
        <button 
          onClick={handleInstallClick}
          className={styles.install_button}
        >
          Instalar app
        </button>
      )}
    </>
  );
};

export default function InstallPWA() {
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    if (typeof navigator !== "undefined") {
      const ua = navigator.userAgent.toLowerCase();
      setIsIOS(/ipad|iphone|ipod/.test(ua) && !(window as any).MSStream);
      setIsStandalone(window.matchMedia("(display-mode: standalone)").matches);
    }
  }, []);

  if (isStandalone) {
    return null; // App já instalado
  }

  return (
    <div>
      {/* Chromium e outros browsers que suportam beforeinstallprompt */}
      {!isIOS && <InstallButton />}

      {/* iOS: instruções manuais */}
      {isIOS && (
        <p>
          Para instalar este app no iOS, toque no botão de compartilhamento
          <span role="img" aria-label="share icon">
            {" "}
            <Safari />
            {" "}
          </span>
          e depois em "Adicionar à Tela de Início"
        </p>
      )}
    </div>
  );
}