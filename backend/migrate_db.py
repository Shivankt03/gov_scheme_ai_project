"""
One-time migration script: adds new columns to profiles and schemes tables.
Run from the backend/ directory:  python migrate_db.py
"""

import psycopg2

DATABASE = {
    "host": "localhost",
    "port": 5432,
    "dbname": "govt_scheme_db",
    "user": "postgres",
    "password": "shiv112",
}

MIGRATIONS = [
    # profiles table – optional extended fields
    "ALTER TABLE profiles ADD COLUMN IF NOT EXISTS marital_status  VARCHAR(20);",
    "ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_bpl           BOOLEAN;",
    "ALTER TABLE profiles ADD COLUMN IF NOT EXISTS domicile_certificate BOOLEAN;",
    # schemes table – new detail fields
    "ALTER TABLE schemes  ADD COLUMN IF NOT EXISTS application_deadline TIMESTAMP;",
    "ALTER TABLE schemes  ADD COLUMN IF NOT EXISTS documents_required   TEXT;",
    "ALTER TABLE schemes  ADD COLUMN IF NOT EXISTS scheme_type          VARCHAR(20);",
]

def main():
    conn = psycopg2.connect(**DATABASE)
    conn.autocommit = True
    cur = conn.cursor()
    for sql in MIGRATIONS:
        print(f"Running: {sql.strip()}")
        cur.execute(sql)
        print("  ✓ OK")
    cur.close()
    conn.close()
    print("\nMigration complete!")

if __name__ == "__main__":
    main()
