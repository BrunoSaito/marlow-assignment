import create, {GetState, SetState} from 'zustand';
import uuid from 'react-native-uuid';
import { ChecklistItemStatus } from '../model';
import _ from 'lodash';
import { persist } from 'zustand/middleware';
import { localDataSource } from '../data/storage';

export const LOCAL_STORAGE_PERSONAL_CHECKLIST_DATA = 'localStorage-personalChecklistData';

export interface PersonalChecklistItem {
  id: string;
  name: string;
  createdAt: number;
  status: ChecklistItemStatus;
}

export interface PersonalChecklist {
  id: string;
  name: string;
  createdAt?: number;
  items?: PersonalChecklistItem[];
}

interface PersonalChecklistState {
  checklists: PersonalChecklist[];
  addChecklist: (checklistName: string) => void;
  deleteChecklist: (checklistName: string) => PersonalChecklist[];
  updateChecklist: (id: string, checklist: Partial<PersonalChecklist>) => PersonalChecklist;
  updateChecklistItems: (id: string, checklistItems: Partial<PersonalChecklistItem>[]) => PersonalChecklist;
  deleteChecklistItems: (id: string, checklistItemIdToDelete: string) => PersonalChecklist;
  updatePersonalChecklistItemStatus: (id: string, checklistItemId: string, newStatus: ChecklistItemStatus) => PersonalChecklist;
}

const createPersonalChecklistStore = (
  _set: SetState<PersonalChecklistState>,
  _get: GetState<PersonalChecklistState>,
) => ({
  checklists: [],
});

const addChecklist = (checklistName: string) =>
  (set: SetState<PersonalChecklistState>, get: GetState<PersonalChecklistState>) => {
    const previousChecklists = get().checklists;

    const checklistToBeAddeed: PersonalChecklist = {
      name: checklistName,
      id: uuid.v4().toString(),
      createdAt: new Date().getTime(),
    }

    set({ checklists: [...previousChecklists, checklistToBeAddeed] });
  };

const deleteChecklist = (id: string) =>
  (set: SetState<PersonalChecklistState>, get: GetState<PersonalChecklistState>) => {
    const newChecklists = get().checklists.filter(checklist => checklist.id !== id);

    set({ checklists: newChecklists })

    return newChecklists;
  }

const updateChecklist = (id: string, checklist: Partial<PersonalChecklist>) =>
  (set: SetState<PersonalChecklistState>, get: GetState<PersonalChecklistState>) => {
    const checklistToUpdate = get().checklists.find(checklist => checklist.id === id);
    const untouchedChecklists = get().checklists.filter(checklist => checklist.id !== id);

    if (!checklistToUpdate) {
      return;
    }

    const newChecklist = _.merge(checklistToUpdate, checklist);

    const newChecklists = [
      ...untouchedChecklists,
      newChecklist,
    ];

    set({ checklists: newChecklists })

    return newChecklist;
  }

const updateChecklistItems = (id: string, checklistItems: Partial<PersonalChecklistItem>[]) =>
  (set: SetState<PersonalChecklistState>, get: GetState<PersonalChecklistState>) => {
    const checklistToUpdate = get().checklists.find(checklist => checklist.id === id);
    const untouchedChecklists = get().checklists.filter(checklist => checklist.id !== id);

    const newChecklistItems: PersonalChecklistItem[] = checklistItems.map(newItem => {
      if (!!newItem.status) {
        return {
          ...checklistToUpdate.items.find(item => item.id === newItem.id),
          name: newItem.name,
        }
      }

      return {
        id: uuid.v4().toString(),
        createdAt: new Date().getTime(),
        status: ChecklistItemStatus.NotDone,
        name: newItem.name,
      }
    });

    const newChecklist = {
      ...checklistToUpdate,
      items: newChecklistItems,
    };

    const newChecklists = [
      ...untouchedChecklists,
      newChecklist,
    ];

    set({ checklists: newChecklists })

    return newChecklist;
  }

const deleteChecklistItems = (id: string, checklistItemIdToDelete: string) =>
  (set: SetState<PersonalChecklistState>, get: GetState<PersonalChecklistState>) => {
    const checklistToUpdate = get().checklists.find(checklist => checklist.id === id);
    const untouchedChecklists = get().checklists.filter(checklist => checklist.id !== id);

    const newChecklistItems: PersonalChecklistItem[] = checklistToUpdate.items.filter(item => item.id !== checklistItemIdToDelete);

    const newChecklist = {
      ...checklistToUpdate,
      items: newChecklistItems,
    };

    const newChecklists = [
      ...untouchedChecklists,
      newChecklist,
    ];

    set({ checklists: newChecklists })

    return newChecklist;
  }

const updatePersonalChecklistItemStatus = (id: string, checklistItemId: string, newStatus: ChecklistItemStatus) =>
  (set: SetState<PersonalChecklistState>, get: GetState<PersonalChecklistState>) => {
    const checklistToUpdate = get().checklists.find(checklist => checklist.id === id);
    const untouchedChecklists = get().checklists.filter(checklist => checklist.id !== id);

    const newCheckListItemIndex = checklistToUpdate.items.findIndex(item => item.id === checklistItemId);
    const newChecklistItem: PersonalChecklistItem = {
      ...checklistToUpdate.items.find(item => item.id === checklistItemId),
      status: newStatus,
    };

    const updatedChecklistItems = [...checklistToUpdate.items];
    updatedChecklistItems.splice(newCheckListItemIndex, 1, newChecklistItem);

    const newChecklist: PersonalChecklist = {
      ...checklistToUpdate,
      items: updatedChecklistItems,
    };

    const newChecklists = [
      ...untouchedChecklists,
      newChecklist,
    ];

    set({ checklists: newChecklists })

    return newChecklist;
  }

const createPersonalChecklistActions = (
  set: SetState<PersonalChecklistState>,
  get: GetState<PersonalChecklistState>,
) => ({
  addChecklist: (checklistName: string) => addChecklist(checklistName)(set, get),
  deleteChecklist :(id: string) => deleteChecklist(id)(set, get),
  updateChecklist: (id: string, checklist: Partial<PersonalChecklist>) => updateChecklist(id, checklist)(set, get),
  updateChecklistItems: (id: string, checklistItems: Partial<PersonalChecklistItem>[]) => updateChecklistItems(id, checklistItems)(set, get),
  deleteChecklistItems: (id: string, checklistItemIdToDelete: string) => deleteChecklistItems(id, checklistItemIdToDelete)(set, get),
  updatePersonalChecklistItemStatus: (id: string, checklistItemId: string, newStatus: ChecklistItemStatus) => updatePersonalChecklistItemStatus(id, checklistItemId, newStatus)(set, get),
});

export const usePersonalChecklistStore = create<PersonalChecklistState>(
  persist(
    (set, get) => ({
      ...createPersonalChecklistStore(set, get),
      ...createPersonalChecklistActions(set, get),
    }),
    {
      name: LOCAL_STORAGE_PERSONAL_CHECKLIST_DATA,
      getStorage: () => localDataSource,
    },
  ),
);
