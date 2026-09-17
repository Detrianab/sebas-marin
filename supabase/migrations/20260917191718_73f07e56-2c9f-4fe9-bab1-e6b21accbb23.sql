CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TABLE public.chat_threads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  title text NOT NULL DEFAULT 'Nueva conversación',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.chat_threads TO authenticated;
GRANT ALL ON public.chat_threads TO service_role;
ALTER TABLE public.chat_threads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own chat threads" ON public.chat_threads FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users create own chat threads" ON public.chat_threads FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own chat threads" ON public.chat_threads FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users delete own chat threads" ON public.chat_threads FOR DELETE TO authenticated USING (auth.uid() = user_id);
CREATE TRIGGER set_chat_threads_updated_at BEFORE UPDATE ON public.chat_threads FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE INDEX chat_threads_user_updated_idx ON public.chat_threads (user_id, updated_at DESC);

CREATE TABLE public.chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id uuid NOT NULL REFERENCES public.chat_threads(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  role text NOT NULL CHECK (role IN ('user', 'assistant')),
  parts jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, DELETE ON public.chat_messages TO authenticated;
GRANT ALL ON public.chat_messages TO service_role;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own chat messages" ON public.chat_messages FOR SELECT TO authenticated USING (auth.uid() = user_id AND EXISTS (SELECT 1 FROM public.chat_threads t WHERE t.id = thread_id AND t.user_id = auth.uid()));
CREATE POLICY "Users create own chat messages" ON public.chat_messages FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id AND EXISTS (SELECT 1 FROM public.chat_threads t WHERE t.id = thread_id AND t.user_id = auth.uid()));
CREATE POLICY "Users delete own chat messages" ON public.chat_messages FOR DELETE TO authenticated USING (auth.uid() = user_id);
CREATE INDEX chat_messages_thread_created_idx ON public.chat_messages (thread_id, created_at);

CREATE TABLE public.quote_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  insurance_type text NOT NULL CHECK (insurance_type IN ('salud','automovil','hogar','empresa','accidentes','vida','funerarios')),
  insured_name text NOT NULL,
  email text,
  phone text,
  details jsonb NOT NULL DEFAULT '{}'::jsonb,
  comments text,
  consent boolean NOT NULL DEFAULT false,
  status text NOT NULL DEFAULT 'nueva' CHECK (status IN ('nueva','contactada','cotizada','cerrada')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK (email IS NOT NULL OR phone IS NOT NULL)
);
GRANT INSERT ON public.quote_requests TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.quote_requests TO authenticated;
GRANT ALL ON public.quote_requests TO service_role;
ALTER TABLE public.quote_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone submits quote request" ON public.quote_requests FOR INSERT TO anon, authenticated WITH CHECK (consent = true AND (user_id IS NULL OR auth.uid() = user_id));
CREATE POLICY "Users view own quote requests" ON public.quote_requests FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users update own quote requests" ON public.quote_requests FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users delete own quote requests" ON public.quote_requests FOR DELETE TO authenticated USING (auth.uid() = user_id);
CREATE TRIGGER set_quote_requests_updated_at BEFORE UPDATE ON public.quote_requests FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE INDEX quote_requests_user_created_idx ON public.quote_requests (user_id, created_at DESC);