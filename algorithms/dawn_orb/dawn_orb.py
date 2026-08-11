"""Dawn ORB: dual-session opening range breakout."""

from __future__ import annotations

from typing import List, Optional

from drift_engine import Bar, atr


def _minute_of_day(ts: int) -> int:
    # synthetic clock: treat ts epoch minutes into a 24h cycle for research
    return (ts // 60) % (24 * 60)


def in_session_window(ts: int, start_min: int, range_bars: int = 4) -> bool:
    m = _minute_of_day(ts)
    return start_min <= m < start_min + range_bars * 60


def opening_range(bars: List[Bar], end_i: int, lookback: int = 4) -> tuple[float, float]:
    window = bars[max(0, end_i - lookback + 1) : end_i + 1]
    return max(b.high for b in window), min(b.low for b in window)


def signal(bars: List[Bar], i: int) -> Optional[int]:
    """
    London research window ~ 03:00 ET proxy, New York ~ 09:30 ET proxy.
    On synthetic data we map to minute-of-day buckets.
    """
    if i < 30:
        return None
    m = _minute_of_day(bars[i].ts)
    # trigger after range completes
    london = 3 * 60
    ny = 9 * 60 + 30
    session = None
    if london + 4 * 60 <= m < london + 5 * 60:
        session = london
    elif ny + 4 * 60 <= m < ny + 5 * 60:
        session = ny
    if session is None:
        return None

    # rebuild range from the prior 4 bars
    hi, lo = opening_range(bars, i - 1, 4)
    width = hi - lo
    a = atr(bars, i)
    if a <= 0:
        return None
    # volatility band: skip tiny or huge ranges
    if width < 0.35 * a or width > 2.2 * a:
        return None

    close = bars[i].close
    if close > hi:
        return 1
    if close < lo:
        return -1
    return None


STRATEGY = {
    "id": "dawn_orb",
    "name": "Dawn ORB",
    "stop_atr": 1.0,
    "target_r": 1.6,
    "signal": signal,
}
