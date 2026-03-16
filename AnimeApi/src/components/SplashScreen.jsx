import { useEffect, useState } from "react";

export default function SplashScreen({ onDone }) {
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const leaveTimer = setTimeout(() => setLeaving(true), 1400);
    const doneTimer = setTimeout(() => onDone(), 1900);
    return () => {
      clearTimeout(leaveTimer);
      clearTimeout(doneTimer);
    };
  }, [onDone]);

  return (
    <div className={`splash${leaving ? " splash--out" : ""}`}>
      <div className="splash-inner">
        <div className="splash-sigil" />
        <span className="splash-title">Anime Vault</span>
      </div>
    </div>
  );
}
