-- Row Level Security (RLS) Setup for Golf Caddy (Development Version)
-- This script enables RLS with development-friendly policies
-- Note: These policies will need to be updated when Supabase Auth is integrated

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE holes ENABLE ROW LEVEL SECURITY;
ALTER TABLE rounds ENABLE ROW LEVEL SECURITY;
ALTER TABLE shots ENABLE ROW LEVEL SECURITY;

-- Development policies (temporarily allow all operations for authenticated development)
-- These will be replaced with proper auth-based policies in production

-- Users table - temporarily allow all operations
CREATE POLICY "Dev: Allow all operations on users" ON users
    FOR ALL USING (true) WITH CHECK (true);

-- Courses table - allow read access to all, write access temporarily open
CREATE POLICY "Dev: Allow read access to courses" ON courses
    FOR SELECT USING (true);

CREATE POLICY "Dev: Allow write access to courses" ON courses
    FOR INSERT USING (true) WITH CHECK (true);

CREATE POLICY "Dev: Allow update access to courses" ON courses
    FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "Dev: Allow delete access to courses" ON courses
    FOR DELETE USING (true);

-- Holes table - same as courses
CREATE POLICY "Dev: Allow read access to holes" ON holes
    FOR SELECT USING (true);

CREATE POLICY "Dev: Allow write access to holes" ON holes
    FOR INSERT USING (true) WITH CHECK (true);

CREATE POLICY "Dev: Allow update access to holes" ON holes
    FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "Dev: Allow delete access to holes" ON holes
    FOR DELETE USING (true);

-- Rounds table - temporarily allow all operations
CREATE POLICY "Dev: Allow all operations on rounds" ON rounds
    FOR ALL USING (true) WITH CHECK (true);

-- Shots table - temporarily allow all operations
CREATE POLICY "Dev: Allow all operations on shots" ON shots
    FOR ALL USING (true) WITH CHECK (true);

-- Comments for future production policies:
-- TODO: When Supabase Auth is integrated:
-- 1. Replace dev policies with proper auth.uid() based policies
-- 2. Users should only see/edit their own profile
-- 3. Rounds and shots should be restricted to the owning user
-- 4. Courses and holes should be publicly readable but admin-writable
-- 5. Add social features policies (e.g., shared rounds, leaderboards)

-- Verify RLS is enabled
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM 
    pg_tables
WHERE 
    schemaname = 'public'
    AND tablename IN ('users', 'courses', 'holes', 'rounds', 'shots')
ORDER BY 
    tablename; 