"use client";
import { useEffect, useRef } from "react";
import {
  createChart,
  CandlestickSeries,
  ISeriesApi,
  Time,
} from "lightweight-charts";

import { connectWs, subscribe } from "@/ws";

type Candle = {
  time: Time;
  open: number;
  high: number;
  low: number;
  close: number;
};

export default function TradingChart() {
  const chartRef = useRef<HTMLDivElement>(null);
  const seriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
  const currentCandleRef = useRef<Candle | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    const chart = createChart(chartRef.current, {
      width: chartRef.current.clientWidth,
      height: chartRef.current.clientHeight,
      layout: {
        background: { color: "#09090b" },
        textColor: "#a1a1aa",
      },
      grid: {
        vertLines: { color: "#27272a" },
        horzLines: { color: "#27272a" },
      },
    });

    const series = chart.addSeries(CandlestickSeries);
    seriesRef.current = series;

    const initialData: Candle[] = [
      { time: "2025-05-01", open: 82, high: 88, low: 80, close: 86 },
      { time: "2025-05-02", open: 86, high: 92, low: 84, close: 90 },
      { time: "2025-05-03", open: 90, high: 94, low: 87, close: 89 },
      { time: "2025-05-04", open: 89, high: 95, low: 86, close: 93 },
      { time: "2025-05-05", open: 93, high: 98, low: 91, close: 96 },
      { time: "2025-05-06", open: 96, high: 101, low: 94, close: 99 },
      { time: "2025-05-07", open: 99, high: 105, low: 96, close: 103 },
      { time: "2025-05-08", open: 103, high: 109, low: 100, close: 107 },
      { time: "2025-05-09", open: 107, high: 112, low: 104, close: 110 },
      { time: "2025-05-10", open: 110, high: 116, low: 108, close: 115 },
    ];

    series.setData(initialData);
    currentCandleRef.current = initialData[initialData.length - 1];
    chart.timeScale().fitContent();

    connectWs();

    subscribe((message) => {
      if (message.type !== "TRADE") return;

      const price = Number(message.data.price);
      if (!price || !seriesRef.current || !currentCandleRef.current) return;

      const current = currentCandleRef.current;

      const updatedCandle: Candle = {
        time: current.time,
        open: current.open,
        high: Math.max(current.high, price),
        low: Math.min(current.low, price),
        close: price,
      };

      currentCandleRef.current = updatedCandle;
      seriesRef.current.update(updatedCandle);
    });

    return () => {
      chart.remove();
    };
  }, []);

  return <div ref={chartRef} className="w-full h-full" />;
}