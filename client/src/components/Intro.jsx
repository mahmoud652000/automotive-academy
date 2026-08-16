import { useEffect } from "react";
import "./Intro.css";

export default function Intro({ onFinish }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="intro">
      {/* توهج خلفي */}
      <div className="intro-glow" />

      {/* حلقة دائرية دوارة خلف اللوجو */}
      <div className="ring ring1" />
      <div className="ring ring2" />

      {/* خطوط السرعة */}
      <div className="speed speed1" />
      <div className="speed speed2" />
      <div className="speed speed3" />

      {/* اللوجو */}
      <div className="logo-wrap">
        <div className="logo-shadow" />
        <img src="/logo.png" alt="Automotive Academy" className="logo" />
        <div className="shine" />
      </div>

      {/* اللودر */}
      <div className="loader">
        <span>LOADING</span>
        <div className="loader-track">
          <div className="loader-progress" />
        </div>
      </div>
    </div>
  );
}
