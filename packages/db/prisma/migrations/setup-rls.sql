-- Row Level Security (RLS) Setup for Golf Caddy
-- This script enables RLS and creates policies for all tables

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE holes ENABLE ROW LEVEL SECURITY;
ALTER TABLE rounds ENABLE ROW LEVEL SECURITY;
ALTER TABLE shots ENABLE ROW LEVEL SECURITY;

-- Users table policies
-- Users can only read and update their own profile
CREATE POLICY "Users can view their own profile" ON users
    FOR SELECT USING (auth.uid()::text = id);

CREATE POLICY "Users can update their own profile" ON users
    FOR UPDATE USING (auth.uid()::text = id);

-- Courses table policies
-- All authenticated users can view courses (public data)
CREATE POLICY "Courses are viewable by all authenticated users" ON courses
    FOR SELECT TO authenticated
    USING (true);

-- Only admins can insert/update/delete courses
CREATE POLICY "Only admins can manage courses" ON courses
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid()::text 
            AND users.email IN ('admin@example.com') -- Add admin emails here
        )
    );

-- Holes table policies
-- All authenticated users can view holes (linked to viewable courses)
CREATE POLICY "Holes are viewable by all authenticated users" ON holes
    FOR SELECT TO authenticated
    USING (true);

-- Only admins can manage holes
CREATE POLICY "Only admins can manage holes" ON holes
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid()::text 
            AND users.email IN ('admin@example.com')
        )
    );

-- Rounds table policies
-- Users can only view their own rounds
CREATE POLICY "Users can view their own rounds" ON rounds
    FOR SELECT USING (auth.uid()::text = "userId");

-- Users can create their own rounds
CREATE POLICY "Users can create their own rounds" ON rounds
    FOR INSERT WITH CHECK (auth.uid()::text = "userId");

-- Users can update their own rounds
CREATE POLICY "Users can update their own rounds" ON rounds
    FOR UPDATE USING (auth.uid()::text = "userId");

-- Users can delete their own rounds
CREATE POLICY "Users can delete their own rounds" ON rounds
    FOR DELETE USING (auth.uid()::text = "userId");

-- Shots table policies
-- Users can only view their own shots
CREATE POLICY "Users can view their own shots" ON shots
    FOR SELECT USING (auth.uid()::text = "userId");

-- Users can create their own shots
CREATE POLICY "Users can create their own shots" ON shots
    FOR INSERT WITH CHECK (auth.uid()::text = "userId");

-- Users can update their own shots
CREATE POLICY "Users can update their own shots" ON shots
    FOR UPDATE USING (auth.uid()::text = "userId");

-- Users can delete their own shots
CREATE POLICY "Users can delete their own shots" ON shots
    FOR DELETE USING (auth.uid()::text = "userId");

-- Create a function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
    INSERT INTO public.users (id, email, name, created_at, updated_at)
    VALUES (
        NEW.id::text,
        NEW.email,
        NEW.raw_user_meta_data->>'name',
        NOW(),
        NOW()
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO authenticated;

-- Test queries to verify RLS is working
-- These should return empty results when run as anon user
-- SELECT * FROM users; -- Should only see own user
-- SELECT * FROM rounds; -- Should only see own rounds
-- SELECT * FROM shots; -- Should only see own shots
-- SELECT * FROM courses; -- Should see all courses
-- SELECT * FROM holes; -- Should see all holes 