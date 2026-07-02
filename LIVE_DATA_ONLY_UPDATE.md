# Health Dynamics Live Data Update

This build removes the hardcoded/demo dashboard values from Health Dynamics.

## Changed
- Removed fixed sample health score, sleep, water, steps, mood, weight, blood pressure, and greeting values.
- Dashboard cards now show `No data` or `—` until the user saves local entries.
- Health score is calculated only from available saved local data.
- Progress bars appear only when the relevant data exists.
- Recent chart displays an empty-state message until live entries are saved.
- Water goal is no longer assumed unless the user enters one.

## Data behavior
Health Dynamics data remains local-first in browser storage. No cloud database is added.
