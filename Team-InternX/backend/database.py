import sqlite3
import json
import os
from typing import List, Optional
from models import StudentProfile, InternshipOpportunity, ApplicationRecord
from seed_data import SEED_INTERNSHIPS

DB_FILE = os.path.join(os.path.dirname(__file__), "internx.db")

def get_db_connection():
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Profile table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS student_profile (
        id INTEGER PRIMARY KEY DEFAULT 1,
        data TEXT NOT NULL
    )
    """)
    
    # Applications table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS applications (
        id TEXT PRIMARY KEY,
        job_id TEXT NOT NULL,
        status TEXT NOT NULL,
        notes TEXT,
        applied_date TEXT,
        deadline TEXT,
        reminder_date TEXT
    )
    """)
    
    # Insert default profile if not exists
    cursor.execute("SELECT COUNT(*) FROM student_profile")
    if cursor.fetchone()[0] == 0:
        default_profile = StudentProfile()
        cursor.execute("INSERT INTO student_profile (id, data) VALUES (1, ?)", (default_profile.model_dump_json(),))
        
    # Insert default initial application tracking records if empty
    cursor.execute("SELECT COUNT(*) FROM applications")
    if cursor.fetchone()[0] == 0:
        default_apps = [
            ApplicationRecord(id="app-1", job_id="job-1", status="Saved", notes="Top match AI Engineer role"),
            ApplicationRecord(id="app-2", job_id="job-2", status="Applied", applied_date="2026-08-10", notes="Application submitted via web portal"),
            ApplicationRecord(id="app-3", job_id="job-3", status="Interviewing", applied_date="2026-08-05", reminder_date="2026-08-20", notes="Technical Round 1 scheduled"),
            ApplicationRecord(id="app-4", job_id="job-4", status="Offered", applied_date="2026-07-28", notes="Stipend: ₹55k/mo"),
        ]
        for app in default_apps:
            cursor.execute("""
            INSERT INTO applications (id, job_id, status, notes, applied_date, deadline, reminder_date)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            """, (app.id, app.job_id, app.status, app.notes, app.applied_date, app.deadline, app.reminder_date))

    conn.commit()
    conn.close()

def load_profile() -> StudentProfile:
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT data FROM student_profile WHERE id = 1")
    row = cursor.fetchone()
    conn.close()
    if row:
        return StudentProfile.model_validate_json(row["data"])
    return StudentProfile()

def save_profile(profile: StudentProfile) -> StudentProfile:
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("INSERT OR REPLACE INTO student_profile (id, data) VALUES (1, ?)", (profile.model_dump_json(),))
    conn.commit()
    conn.close()
    return profile

def get_all_applications() -> List[ApplicationRecord]:
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM applications")
    rows = cursor.fetchall()
    conn.close()
    return [
        ApplicationRecord(
            id=r["id"],
            job_id=r["job_id"],
            status=r["status"],
            notes=r["notes"],
            applied_date=r["applied_date"],
            deadline=r["deadline"],
            reminder_date=r["reminder_date"]
        ) for r in rows
    ]

def save_or_update_application(record: ApplicationRecord) -> ApplicationRecord:
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
    INSERT OR REPLACE INTO applications (id, job_id, status, notes, applied_date, deadline, reminder_date)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    """, (record.id, record.job_id, record.status, record.notes, record.applied_date, record.deadline, record.reminder_date))
    conn.commit()
    conn.close()
    return record
