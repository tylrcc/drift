"""
Drift shared research engine.
Generates reproducible sample bars with session structure, mean reversion,
and trend regimes so research strategies have something to measure against.
"""

from __future__ import annotations

import math
import random
from dataclasses import dataclass
from typing import Callable, List, Optional


@dataclass
class Bar:
    ts: int
    open: float
    high: float
    low: float
    close: float
    volume: float


@dataclass
class Trade:
    entry_i: int
    exit_i: int
    side: int
    entry: float
    exit: float
    pnl_r: float


@dataclass
class Metrics:
    trades: int
    win_rate: float
    profit_factor: float
    sharpe: float
    max_drawdown_pct: float
    avg_trades_per_week: float


def generate_bars(
    n: int = 5000,
    start: float = 100.0,
    seed: int = 7,
    bar_minutes: int = 60,
) -> List[Bar]:
    rng = random.Random(seed)
    bars: List[Bar] = []
    price = start
    ts = 1_700_000_000
    for i in range(n):
        minute = (ts // 60) % (24 * 60)
        # trending + mean reverting latent state
        trend = 0.00055 * math.sin(i / 220.0)
        # stronger pull toward a slow anchor so mean reversion has edge
        anchor = start * (1 + 0.02 * math.sin(i / 400.0))
        mr_pull = -0.22 * math.tanh((price - anchor) / max(1.0, anchor * 0.03))
        # session open impulses (London ~3:00, NY ~9:30 in minute clock)
        impulse = 0.0
        if 3 * 60 <= minute < 3 * 60 + 5:
            impulse = 0.004 * (1 if rng.random() > 0.45 else -1)
        if 9 * 60 + 30 <= minute < 9 * 60 + 35:
            impulse = 0.005 * (1 if rng.random() > 0.42 else -1)
        shock = rng.gauss(0, 0.0032)
        ret = trend + mr_pull * 0.002 + impulse + shock
        o = price
        c = max(1.0, price * (1 + ret))
        wick = abs(rng.gauss(0, 0.0018)) * price
        h = max(o, c) + wick
        l = min(o, c) - wick
        # volume pops near opens and extremes
        base_vol = 900_000
        vol_boost = 1.0 + (2.2 if abs(impulse) > 0 else 0.0) + min(2.0, abs(ret) * 80)
        vol = abs(rng.gauss(base_vol * vol_boost, 180_000))
        bars.append(Bar(ts=ts, open=o, high=h, low=l, close=c, volume=vol))
        price = c
        ts += bar_minutes * 60
    return bars


def atr(bars: List[Bar], i: int, length: int = 14) -> float:
    if i < 1:
        return bars[i].high - bars[i].low
    total = 0.0
    start = max(1, i - length + 1)
    for j in range(start, i + 1):
        tr = max(
            bars[j].high - bars[j].low,
            abs(bars[j].high - bars[j - 1].close),
            abs(bars[j].low - bars[j - 1].close),
        )
        total += tr
    return total / max(1, i - start + 1)


SignalFn = Callable[[List[Bar], int], Optional[int]]


def run_backtest(
    bars: List[Bar],
    signal: SignalFn,
    stop_atr: float = 1.2,
    target_r: float = 2.0,
    bar_minutes: int = 60,
) -> Metrics:
    trades: List[Trade] = []
    equity = 1.0
    peak = 1.0
    max_dd = 0.0
    i = 40
    while i < len(bars) - 2:
        side = signal(bars, i)
        if not side:
            i += 1
            continue
        a = atr(bars, i)
        entry = bars[i].close
        stop_dist = max(a * stop_atr, entry * 0.001)
        stop = entry - side * stop_dist
        target = entry + side * stop_dist * target_r
        exit_px = entry
        exit_i = i
        for j in range(i + 1, min(len(bars), i + 80)):
            bar = bars[j]
            hit_stop = (side > 0 and bar.low <= stop) or (side < 0 and bar.high >= stop)
            hit_tgt = (side > 0 and bar.high >= target) or (side < 0 and bar.low <= target)
            if hit_stop and hit_tgt:
                exit_px = stop
                exit_i = j
                break
            if hit_stop:
                exit_px = stop
                exit_i = j
                break
            if hit_tgt:
                exit_px = target
                exit_i = j
                break
            exit_px = bar.close
            exit_i = j
        pnl_r = side * (exit_px - entry) / stop_dist
        trades.append(
            Trade(entry_i=i, exit_i=exit_i, side=side, entry=entry, exit=exit_px, pnl_r=pnl_r)
        )
        equity *= 1 + 0.01 * pnl_r
        peak = max(peak, equity)
        max_dd = max(max_dd, (peak - equity) / peak)
        i = exit_i + 1

    if not trades:
        return Metrics(0, 0, 0, 0, 0, 0)

    wins = [t.pnl_r for t in trades if t.pnl_r > 0]
    losses = [t.pnl_r for t in trades if t.pnl_r <= 0]
    gross_win = sum(wins) if wins else 0.0
    gross_loss = abs(sum(losses)) if losses else 1e-9
    rets = [t.pnl_r for t in trades]
    mean = sum(rets) / len(rets)
    var = sum((r - mean) ** 2 for r in rets) / max(1, len(rets) - 1)
    std = math.sqrt(var) if var > 0 else 1e-9
    weeks = max(1.0, (len(bars) * bar_minutes) / (60 * 24 * 7))
    return Metrics(
        trades=len(trades),
        win_rate=100.0 * len(wins) / len(trades),
        profit_factor=gross_win / gross_loss,
        sharpe=(mean / std) * math.sqrt(252),
        max_drawdown_pct=100.0 * max_dd,
        avg_trades_per_week=len(trades) / weeks,
    )
