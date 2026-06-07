# Ledger Module

Source of truth for money movement.

Responsibilities:
- Record debits
- Record credits
- Generate balance calculations
- Support auditing

Important:
Never modify existing ledger records.
Only append new entries.

Balance should be derived from ledger entries.