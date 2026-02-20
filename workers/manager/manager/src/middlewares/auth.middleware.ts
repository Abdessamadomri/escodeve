import { Context, Next } from 'hono';
import { verify } from 'hono/jwt';
import { Env } from '../shared/types';

export async function authMiddleware(c: Context<{ Bindings: Env }>, next: Next) {
  const authHeader = c.req.header('Authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ error: 'Token manquant' }, 401);
  }

  const token = authHeader.substring(7);

  try {
    const payload = await verify(token, c.env.JWT_SECRET, 'HS256');
    
    if (payload.role !== 'ADMIN_SCHOOL' && payload.role !== 'ADMIN_ECOLE') {
      return c.json({ error: 'Accès refusé: Admin École uniquement' }, 403);
    }

    if (!payload.schoolId) {
      return c.json({ error: 'schoolId manquant dans le token' }, 403);
    }

    (c as any).adminId = payload.id;
    (c as any).schoolId = payload.schoolId;
    
    await next();
  } catch (error) {
    return c.json({ error: 'Token invalide ou expiré' }, 401);
  }
}
