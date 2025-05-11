// src/components/VLibrasPlayer.tsx
import {
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
  ForwardRefRenderFunction,
} from "react";

export interface VLibrasPlayerHandle {
  translate: (text: string) => void;
}

const VLibrasPlayer: ForwardRefRenderFunction<VLibrasPlayerHandle> = (
  _,
  ref
) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<any>(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "/vlibras.js";
    script.async = true;
    script.onload = () => {
      if (!window.VLibras || !wrapperRef.current) return;

      const player = new window.VLibras.Player({
        target: { name: "rnp_webgl", path: "/unity" },
      });

      player.on("load", () => {
        console.log("VLibras Player carregado");
      });

      player.load(wrapperRef.current);

      playerRef.current = player;
    };

    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Expõe `translate` para o pai
  useImperativeHandle(ref, () => ({
    translate: (text: string) => {
      if (playerRef.current) {
        playerRef.current.translate(text);
      }
    },
  }));

  return (
    <div className="container">
      <div id="window">
        <div id="wrapper" ref={wrapperRef}></div>
      </div>
    </div>
  );
};

export default forwardRef(VLibrasPlayer);
