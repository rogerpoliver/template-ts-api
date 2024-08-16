import type { FastifyInstance } from "fastify";

import { verifyJwt } from '@/http/middlewares/verify-jwt';

import { authenticate } from './authenticate.controller';
import { profile } from './profile.controller';
import { refresh } from './refresh.controller';
import { register } from './register.controller';

export async function userRoutes(app: FastifyInstance) {
	app.post("/users", register);
	app.post("/sessions", authenticate);

	app.patch("/token/refresh", refresh);

	app.get("/me", { onRequest: [verifyJwt] }, profile);
}
