// TODO: Implement auth once Supabase is wired in — see SECURITY_TODO.md
// import { Request, Response, NextFunction } from 'express';
// import { getSupabase } from '../db/supabase.js';
//
// export async function requireAuth(req: Request, res: Response, next: NextFunction) {
//   const token = req.headers.authorization?.replace('Bearer ', '');
//   if (!token) return res.status(401).json({ error: 'Unauthorized' });
//   try {
//     const supabase = getSupabase();
//     const { data, error } = await supabase.auth.getUser(token);
//     if (error || !data.user) return res.status(401).json({ error: 'Unauthorized' });
//     (req as Request & { userId: string }).userId = data.user.id;
//     next();
//   } catch {
//     return res.status(401).json({ error: 'Unauthorized' });
//   }
// }
