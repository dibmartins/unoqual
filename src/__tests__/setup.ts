import { vi } from 'vitest';
import { mockDeep, mockReset } from 'vitest-mock-extended';
import { PrismaClient } from '@prisma/client';

// Criamos o mock global
export const prismaMock = mockDeep<PrismaClient>();

// Interceptamos o módulo prisma antes que qualquer outro código o importe
vi.mock('@/lib/prisma', () => ({
  __esModule: true,
  default: prismaMock,
}));

// Resetamos os mocks entre cada teste
beforeEach(() => {
  mockReset(prismaMock);
});
