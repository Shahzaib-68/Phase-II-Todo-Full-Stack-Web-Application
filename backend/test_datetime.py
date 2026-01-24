from datetime import datetime, timezone

# Test if datetime.now(timezone.utc) works
try:
    dt = datetime.now(timezone.utc)
    print(f"datetime.now(timezone.utc) works: {dt}")
except Exception as e:
    print(f"Error with datetime.now(timezone.utc): {e}")

# Test if datetime.utcnow() works (alternative)
try:
    dt = datetime.utcnow()
    print(f"datetime.utcnow() works: {dt}")
except Exception as e:
    print(f"Error with datetime.utcnow(): {e}")