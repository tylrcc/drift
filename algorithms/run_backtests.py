#!/usr/bin/env python3
"""Run research backtests for all Drift algorithms and print metrics JSON."""

from __future__ import annotations

import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent
sys.path.insert(0, str(ROOT))
sys.path.insert(0, str(ROOT / "dawn_orb"))
sys.path.insert(0, str(ROOT / "steady"))
sys.path.insert(0, str(ROOT / "lift"))
sys.path.insert(0, str(ROOT / "apex"))

from drift_engine import generate_bars, run_backtest  # noqa: E402
import dawn_orb as dawn  # noqa: E402
import steady as steady  # noqa: E402
import lift as lift  # noqa: E402
import apex as apex  # noqa: E402


def main() -> None:
    bars = generate_bars(n=5500, seed=11, bar_minutes=60)
    strategies = [dawn.STRATEGY, steady.STRATEGY, lift.STRATEGY, apex.STRATEGY]
    out = {}
    for s in strategies:
        m = run_backtest(
            bars,
            s["signal"],
            stop_atr=s["stop_atr"],
            target_r=s["target_r"],
            bar_minutes=60,
        )
        out[s["id"]] = {
            "name": s["name"],
            "trades": m.trades,
            "win_rate": round(m.win_rate, 1),
            "profit_factor": round(m.profit_factor, 2),
            "sharpe": round(m.sharpe, 2),
            "max_drawdown_pct": round(m.max_drawdown_pct, 1),
            "avg_trades_per_week": round(m.avg_trades_per_week, 1),
        }
    print(json.dumps(out, indent=2))
    (ROOT / "backtest_results.json").write_text(json.dumps(out, indent=2) + "\n")


if __name__ == "__main__":
    main()
