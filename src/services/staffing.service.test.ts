import { describe, it, expect, vi } from 'vitest';
import { StaffingService } from './staffing.service';
import { prismaMock } from '@/__tests__/setup';

describe('StaffingService', () => {
  describe('saveStaffing', () => {
    it('deve executar a criação da inspeção e dos cálculos dentro de uma transação', async () => {
      const input = {
        facilityId: 'fac-1',
        departmentId: 'dept-1',
        weeklyHours: '36',
        pcm: 5, pci: 0, pcad: 0, pcsi: 0, pcit: 0,
        currentNurses: 2,
        currentTechs: 5,
        calculations: {
          the: 40,
          qp: 3,
          requiredNurses: 1,
          requiredTechs: 2
        }
      };

      const mockInspection = { id: 'ins-new', facilityId: 'fac-1' };
      
      // Mock da transação: O Prisma passa o "tx" que é o próprio prismaMock no nosso helper simplificado
      prismaMock.$transaction.mockImplementation(async (callback) => {
        return callback(prismaMock);
      });

      prismaMock.inspection.create.mockResolvedValue(mockInspection as any);
      prismaMock.staffingCalculation.createMany.mockResolvedValue({ count: 2 });

      const result = await StaffingService.saveStaffing(input);

      expect(prismaMock.inspection.create).toHaveBeenCalledWith(expect.objectContaining({
        data: expect.objectContaining({
          facilityId: input.facilityId,
          inspectorId: 'system-staffing-audit'
        })
      }));

      expect(prismaMock.staffingCalculation.createMany).toHaveBeenCalledWith({
        data: expect.arrayContaining([
          expect.objectContaining({ professionalClass: 'Nurse' }),
          expect.objectContaining({ professionalClass: 'Technician' })
        ])
      });

      expect(result).toEqual(mockInspection);
    });
  });
});
