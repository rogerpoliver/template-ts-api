import { compare } from 'bcryptjs';
import { beforeEach, describe, expect, it } from 'vitest';

import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users.repository';
import { RegisterService } from '@/services/register.service';

import { UserAlreadyExistsError } from './errors/user-already-exists.error';

let usersRepository: InMemoryUsersRepository;
let registerUseCase: RegisterService;

describe("Register Use Case", () => {
	beforeEach(() => {
		usersRepository = new InMemoryUsersRepository();
		registerUseCase = new RegisterService(usersRepository);
	});

	it("should hash user password upon registration", async () => {
		const { user } = await registerUseCase.execute({
			name: "John Doe",
			email: "johndoe@example.com",
			password: "123456",
		});

		const isPasswordHashValid = await compare("123456", user.password_hash);

		expect(isPasswordHashValid).toBe(true);
	});

	it("should not be able to register a new user with an existing email", async () => {
		const email = "johndoe@example.com";

		await registerUseCase.execute({
			name: "John Doe",
			email,
			password: "123456",
		});

		await expect(
			registerUseCase.execute({
				name: "John Doe",
				email,
				password: "123456",
			}),
		).rejects.toBeInstanceOf(UserAlreadyExistsError);
	});

	it("should be able to register a new user", async () => {
		const { user } = await registerUseCase.execute({
			name: "John Doe",
			email: "johndoe@example.com",
			password: "123456",
		});

		expect(user.id).toEqual(expect.any(String));
	});
});
