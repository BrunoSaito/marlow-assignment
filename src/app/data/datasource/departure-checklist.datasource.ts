import { ChecklistItemStatus, DepartureChecklist } from '../../model';
import { useDepartureChecklistStore } from '../../providers';

export const DepartureChecklistDatasource = {
  getDepartureChecklists: async (): Promise<DepartureChecklist[]> => {
    return useDepartureChecklistStore.getState().checklists;
  },

  getDepartureChecklistById: async (id: string): Promise<DepartureChecklist> => {
    const checklists = useDepartureChecklistStore.getState().checklists;

    return checklists.find(checklist => checklist.id === id);
  },

  updateDepartureChecklistItemStatus: async (id: string, checklistItemId: string, newStatus: ChecklistItemStatus): Promise<DepartureChecklist> => {
    const updateDepartureChecklistItemStatus = useDepartureChecklistStore.getState().updateDepartureChecklistItemStatus;

    return updateDepartureChecklistItemStatus(id, checklistItemId, newStatus);
  },
};
