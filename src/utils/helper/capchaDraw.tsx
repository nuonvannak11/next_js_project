"use client";

import React, { useEffect, useRef } from "react";

interface CaptchaCanvasProps {
  digits: number;
}

const CaptchaCanvas: React.FC<CaptchaCanvasProps> = ({ digits }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const prevDigitsRef = useRef<number | null>(null);
  const getRandomColor = (): string => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const drawCaptcha = (input: number) => {
    const canvas = canvasRef.current;
    if (!canvas) {
      console.error("Canvas not found");
      return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      console.error("Failed to get 2D context");
      return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#2a0e00e3";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const inputStr = input.toString();

    for (let i = 0; i < inputStr.length; i++) {
      ctx.font = "22px Arial";
      ctx.fillStyle = getRandomColor();
      ctx.fillText(inputStr[i], 20 * i + 13, 25);
    }

    for (let i = 0; i < 70; i++) {
      ctx.beginPath();
      ctx.arc(
        Math.floor(Math.random() * canvas.width),
        Math.floor(Math.random() * canvas.height),
        Math.random() * 1,
        0,
        2 * Math.PI
      );
      ctx.fillStyle = getRandomColor();
      ctx.fill();
    }
  };

  useEffect(() => {
    if (digits !== prevDigitsRef.current) {
      prevDigitsRef.current = digits;
      drawCaptcha(digits);
    }
  }, [digits]);

  return <canvas ref={canvasRef} width="100" height="35"></canvas>;
};

export default CaptchaCanvas;
