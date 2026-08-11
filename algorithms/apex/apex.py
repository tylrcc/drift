"""Apex: regime filter + breakout + drawdown-aware sizing hook."""

from __future__ import annotations

from typing import List, Optional

from drift_engine import Bar, atr


def sma(vals: List[float], n: int) -> float:
    return sum(vals[-n:]) / n


def realized_vol(closes: List[float], n: int = 20) -> float:
    rets = []
    for i in range(-n, 0):
        rets.append((closes[i] - closes[i - 1]) / closes[i - 1])
    mean = sum(rets) / len(rets)
    var = sum((r - mean) ** 2 for r in rets) / len(rets)
    return var ** 0.5


def regime_ok(bars: List[Bar], i: int) -> bool:
    closes = [b.close for b in bars[: i + 1]]
    vol = realized_vol(closes, 20)
    # stand aside in extreme vol spikes
    return vol < 0.012


def signal(bars: List[Bar], i: int) -> Optional[int]:
    if i < 60:
        return None
    if not regime_ok(bars, i):
        return None
    look = 20
    window = bars[i - look : i]
    hi = max(b.high for b in window)
    lo = min(b.low for b in window)
    a = atr(bars, i)
    close = bars[i].close
    # breakout with buffer
    if close > hi + 0.1 * a:
        return 1
    if close < lo - 0.1 * a:
        return -1
    return None


def size_multiplier(equity_drawdown_pct: float) -> float:
    """Risk overlay: cut size as drawdown expands."""
    if equity_drawdown_pct < 5:
        return 1.0
    if equity_drawdown_pct < 10:
        return 0.6
    if equity_drawdown_pct < 15:
        return 0.35
    return 0.0


STRATEGY = {
    "id": "apex",
    "name": "Apex",
    "stop_atr": 1.25,
    "target_r": 2.2,
    "signal": signal,
}
