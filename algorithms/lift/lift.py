"""Lift: trend continuation on pullbacks."""

from __future__ import annotations

from typing import List, Optional

from drift_engine import Bar, atr


def sma(vals: List[float], n: int) -> float:
    return sum(vals[-n:]) / n


def signal(bars: List[Bar], i: int) -> Optional[int]:
    if i < 80:
        return None
    closes = [b.close for b in bars[: i + 1]]
    slow = sma(closes, 50)
    fast = sma(closes, 20)
    a = atr(bars, i)
    price = closes[-1]
    # uptrend: price above slow, pullback toward fast
    if fast > slow and price <= fast + 0.15 * a and price >= fast - 0.35 * a:
        if bars[i].close > bars[i].open:
            return 1
    # downtrend mirror
    if fast < slow and price >= fast - 0.15 * a and price <= fast + 0.35 * a:
        if bars[i].close < bars[i].open:
            return -1
    return None


STRATEGY = {
    "id": "lift",
    "name": "Lift",
    "stop_atr": 1.3,
    "target_r": 2.8,
    "signal": signal,
}
