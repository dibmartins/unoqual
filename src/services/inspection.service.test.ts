import { describe, it, expect, vi } from 'vitest';
import { InspectionService } from './inspection.service';
import { prismaMock } from '@/__tests__/setup';
import { AppError } from '@/lib/errors';

describe('InspectionService', () => {
  describe('upsertInspection', () => {
    it('deve criar uma nova inspeção quando não houver ID', async () => {
      const input = { facilityId: 'f1', inspectorId: 'i1' };
      const expectedResult = { id: 'new-id', ...input, status: 'draft', createdAt: new Date() };
      
      prismaMock.inspection.create.mockResolvedValue(expectedResult as any);

      const result = await InspectionService.upsertInspection(input);

      expect(prismaMock.inspection.create).toHaveBeenCalledWith({
        data: {
          facilityId: input.facilityId,
          inspectorId: input.inspectorId,
          status: 'draft',
        },
      });
      expect(result).toEqual(expectedResult);
    });

    it('deve atualizar uma inspeção quando houver ID', async () => {
      const input = { id: 'existing-id', facilityId: 'f1', inspectorId: 'i1' };
      const expectedResult = { ...input, status: 'draft' };
      
      prismaMock.inspection.update.mockResolvedValue(expectedResult as any);

      const result = await InspectionService.upsertInspection(input);

      expect(prismaMock.inspection.update).toHaveBeenCalledWith({
        where: { id: input.id },
        data: {
          facilityId: input.facilityId,
          inspectorId: input.inspectorId,
        },
      });
      expect(result).toEqual(expectedResult);
    });

    it('deve lançar AppError em caso de erro no banco', async () => {
      prismaMock.inspection.create.mockRejectedValue(new Error('DB connection failed'));

      await expect(InspectionService.upsertInspection({ facilityId: 'f1', inspectorId: 'i1' }))
        .rejects.toThrow(AppError);
    });
  });

  describe('finalizeInspection', () => {
    it('deve marcar inspeção como completed e definir data de finalização', async () => {
      const id = 'ins-123';
      prismaMock.inspection.update.mockResolvedValue({ id, status: 'completed' } as any);

      await InspectionService.finalizeInspection(id);

      expect(prismaMock.inspection.update).toHaveBeenCalledWith({
        where: { id },
        data: {
          status: 'completed',
          completedAt: expect.any(Date),
        },
      });
    });
  });

  describe('getInspectionWithEntries', () => {
    it('deve lançar 404 se inspeção não existir', async () => {
      prismaMock.inspection.findUnique.mockResolvedValue(null);

      await expect(InspectionService.getInspectionWithEntries('non-existent'))
        .rejects.toThrow('Inspeção não encontrada');
    });
  });
});
