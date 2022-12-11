import { ChecklistItemStatus } from '../../model';
import { PersonalChecklist, PersonalChecklistItem, usePersonalChecklistStore } from '../../providers';

export const ChecklistDatasource = {
  getPersonalChecklists: async (): Promise<PersonalChecklist[]> => {
    return usePersonalChecklistStore.getState().checklists;
  },

  getPersonalChecklistById: async (id: string): Promise<PersonalChecklist> => {
    const checklists = usePersonalChecklistStore.getState().checklists;

    return checklists.find(checklist => checklist.id === id);
  },
  
  addPersonalChecklist: async (checklistName: string): Promise<void> => {
    const addChecklist = usePersonalChecklistStore.getState().addChecklist;

    addChecklist(checklistName);
  },

  deletePersonalChecklist: async (id: string): Promise<PersonalChecklist[]> => {
    const deletePersonalChecklist = usePersonalChecklistStore.getState().deleteChecklist;

    return deletePersonalChecklist(id);
  },

  updatePersonalChecklist: async (id: string, checklist: Partial<PersonalChecklist>): Promise<PersonalChecklist> => {
    const updateChecklist = usePersonalChecklistStore.getState().updateChecklist;

    return updateChecklist(id, checklist);
  },

  updatePersonalChecklistItems: async (id: string, checklistItems: Partial<PersonalChecklistItem>[]): Promise<PersonalChecklist> => {
    const updateChecklistItems = usePersonalChecklistStore.getState().updateChecklistItems;

    return updateChecklistItems(id, checklistItems);
  },

  deletePersonalChecklistItem: async (id: string, checklistItemIdToDelete: string): Promise<PersonalChecklist> => {
    const deleteChecklistItems = usePersonalChecklistStore.getState().deleteChecklistItems;

    return deleteChecklistItems(id, checklistItemIdToDelete);
  },

  updatePersonalChecklistItemStatus: async (id: string, checklistItemId: string, newStatus: ChecklistItemStatus): Promise<PersonalChecklist> => {
    const updatePersonalChecklistItemStatus = usePersonalChecklistStore.getState().updatePersonalChecklistItemStatus;

    return updatePersonalChecklistItemStatus(id, checklistItemId, newStatus);
  },
};
