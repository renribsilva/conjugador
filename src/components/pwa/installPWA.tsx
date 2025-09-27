import { useEffect, useState } from "react";
import Button from "../button";

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
        <Button onClick={handleInstallClick} className="install-button">
          Adicionar à tela inicial
        </Button>
      )}
    </>
  );
};

export default function InstallPWA() {
  const [isIOS, setIsIOS] = useState(false);
  const [isFirefox, setIsFirefox] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    if (typeof navigator !== "undefined") {
      const ua = navigator.userAgent.toLowerCase();
      setIsIOS(/ipad|iphone|ipod/.test(ua) && !(window as any).MSStream);
      setIsFirefox(/firefox/i.test(ua));
      setIsStandalone(window.matchMedia("(display-mode: standalone)").matches);
    }
  }, []);

  if (isStandalone) {
    return null; // App já instalado
  }

  return (
    <div>
      {/* Chromium e outros browsers que suportam beforeinstallprompt */}
      {!isIOS && !isFirefox && <InstallButton />}

      {/* Firefox: instruções manuais */}
      {/* {isFirefox && (
        <p>
          Para instalar este app no Firefox, abra o menu do navegador (três linhas
          no canto superior direito) e selecione "Adicionar à tela inicial".
        </p>
      )} */}

      {/* iOS: instruções manuais */}
      {isIOS && (
        <p>
          Para instalar este app no iOS, toque no botão de compartilhamento
          <span role="img" aria-label="share icon">
            {" "}
            ⎋{" "}
          </span>
          e depois em "Adicionar à Tela de Início"
          <span role="img" aria-label="plus icon">
            {" "}
            ➕{" "}
          </span>.
        </p>
      )}
    </div>
  );
}