
-- 1) Scale project marks from /40 to /80
UPDATE public.weekly_scores SET marks = LEAST(marks * 2, 80);

-- 2) Recompute weekly_score per (week, ranking by marks):
--    Winner bonus: weeks 1-11 top 2 get +20; weeks 12-16 top 1 gets +20
--    Runner-up bonus: next 10 after winners get +10
--    Project component: marks if bonus column had a value (>0) OR if marks > 0; else 0
--    To keep behavior consistent with frontend (project counted if submitted),
--    we treat any row with marks > 0 OR existing bonus > 0 as submitted.
WITH ranked AS (
  SELECT
    id,
    week_number,
    marks,
    ROW_NUMBER() OVER (PARTITION BY week_number ORDER BY marks DESC, created_at ASC) AS rnk
  FROM public.weekly_scores
),
calc AS (
  SELECT
    r.id,
    r.marks AS effective_marks,
    CASE
      WHEN r.week_number <= 11 AND r.rnk <= 2 THEN 20
      WHEN r.week_number >= 12 AND r.rnk <= 1 THEN 20
      ELSE 0
    END AS winner_bonus,
    CASE
      WHEN r.week_number <= 11 AND r.rnk > 2  AND r.rnk <= 12 THEN 10
      WHEN r.week_number >= 12 AND r.rnk > 1  AND r.rnk <= 11 THEN 10
      ELSE 0
    END AS runner_up_bonus
  FROM ranked r
)
UPDATE public.weekly_scores ws
SET
  bonus = c.winner_bonus + c.runner_up_bonus,
  weekly_score = c.effective_marks + c.winner_bonus + c.runner_up_bonus
FROM calc c
WHERE ws.id = c.id;

-- 3) Recompute student cumulative_score and best_weekly_score
WITH agg AS (
  SELECT
    student_id,
    COALESCE(SUM(weekly_score), 0) AS total_score,
    COALESCE(MAX(weekly_score), 0) AS best_score
  FROM public.weekly_scores
  GROUP BY student_id
)
UPDATE public.students s
SET
  cumulative_score = agg.total_score,
  best_weekly_score = agg.best_score
FROM agg
WHERE s.id = agg.student_id;
