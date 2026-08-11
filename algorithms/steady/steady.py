"""Steady: volume-confirmed mean reversion with reversion trigger."""

from __future__ import annotations

from typing import List, Optional

from drift_engine import Bar


def sma(vals: List[float], n: int) -> float:
    return sum(vals[-n:]) / n


def zscore(vals: List[float], n: int = 20) -> float:
    window = vals[-n:]
    mean = sum(window) / n
    var = sum((x - mean) ** 2 for x in window) / n
    std = var ** 0.5
    if std == 0:
        return 0.0
    return (vals[-1] - mean) / std


def signal(bars: List[Bar], i: int) -> Optional[int]:
    if i < 40:
        return None
    closes = [b.close for b in bars[: i + 1]]
    vols = [b.volume for b in bars[: i + 1]]
    z = zscore(closes, 20)
    z_prev = zscore(closes[:-1], 20)
    vol_ratio = vols[-1] / max(1.0, sma(vols, 20))
    # enter when stretch begins to snap back
    if z_prev > 1.4 and z < z_prev and z > 0.4 and vol_ratio > 0.85:
        return -1
    if z_prev < -1.4 and z > z_prev and z < -0.4 and vol_ratio > 0.85:
        return 1
    return None


STRATEGY = {
    "id": "steady",
    "name": "Steady",
    "stop_atr": 1.0,
    "target_r": 1.15,
    "signal": signal,
}
