
## NIAT India AI Bootcamp Leaderboard

A full-stack leaderboard app with Supabase backend, Deep Blue & Gold theme, and a polished competitive dashboard UI.

---

### 1. Database Schema (Supabase)

**`students` table**
- `id`, `name`, `mobile`, `league` (platinum/gold/silver/bronze), `cumulative_score`, `best_weekly_score`, `projects_submitted`, `attendance_count`, `created_at`

**`weekly_scores` table**
- `id`, `student_id`, `week_number`, `marks` (out of 40), `attendance` (boolean), `bonus`, `weekly_score`, `created_at`

**`settings` table**
- `key`, `value` — stores `current_week`, `total_projects`, `total_students`

Seed with realistic demo data: ~40 students across all 4 leagues.

---

### 2. Pages & Routes

- `/` — Main leaderboard (all sections on one scrollable page)

---

### 3. Hero Section
- NIAT India logo/wordmark + "AI Bootcamp Leaderboard" heading
- Subtitle: "Track the top innovators building AI projects every week."
- 3 stat cards: **Total Students**, **Total Projects**, **Current Week** — data pulled live from Supabase

---

### 4. AI Champions Section
- Fetch top 3 students from Platinum League by cumulative score
- **Podium layout**: Rank 2 left, Rank 1 center (taller card), Rank 3 right
- Each card: avatar with initials, name, rank badge, cumulative score, animated gold/silver/bronze crown icon

---

### 5. Overall Leaderboard (4 League Tabs or Sections)
- **Platinum** → **Gold** → **Silver** → **Bronze** league sections with league-colored headers
- Each section: sortable table with columns: Rank | Student Name | Cumulative Score | Best Weekly Score | Projects Submitted | Attendance Count
- Row highlighting for top 3 in each section

---

### 6. Weekly Leaderboard
- Week selector dropdown (Week 1 – Week N)
- Table: Rank | Student Name | Marks (out of 40) | Attendance | Bonus | Weekly Score
- Sorted by weekly score descending

---

### 7. Search Student
- Search input (name or mobile number)
- Live search across all leagues
- Result card shows: Name, League badge, Rank, Cumulative Score, Projects, Attendance

---

### 8. Design System
- **Background**: Deep navy blue gradient (`#0a0f2e` → `#0d1b4b`)
- **Accent**: Gold (`#F5A623` / `#FFD700`) for highlights, ranks, badges
- **Cards**: Glassmorphism-style with subtle blue border and backdrop blur
- **Tables**: Dark-themed with alternating row shading
- **League colors**: Platinum (cyan/white), Gold (amber), Silver (gray), Bronze (orange-brown)
- Fully responsive (mobile-friendly stacked layout)
- Smooth scroll between sections with a sticky navigation bar linking to each section
