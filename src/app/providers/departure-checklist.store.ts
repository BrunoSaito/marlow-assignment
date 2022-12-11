import create, {GetState, SetState} from 'zustand';
import {persist} from 'zustand/middleware';
import { ChecklistItemCategory, ChecklistItemStatus, ChecklistStatus, DepartureChecklist, DepartureChecklistItem } from '../model';
import _ from 'lodash';
import { localDataSource } from '../data/storage';

export const LOCAL_STORAGE_DEPARTURE_CHECKLIST_DATA = 'localStorage-departureChecklistData';

interface DepartureChecklistState {
  checklists: DepartureChecklist[];
  updateDepartureChecklistItemStatus: (id: string, checklistItemId: string, newStatus: ChecklistItemStatus) => DepartureChecklist;
}

const createDepartureChecklistStore = (
  _set: SetState<DepartureChecklistState>,
  _get: GetState<DepartureChecklistState>,
) => ({
  checklists: [
    {
      id: '1',
      status: ChecklistStatus.Archived,
      percentage: 0,
      items: [
        {
          id: '11',
          status: ChecklistItemStatus.NotDone,
          documentInfo: {
            description: 'GMDSS GOC',
            documentNumber: '123/321',
            issueDate: new Date().getTime(),
            unlimited: true,
            categoryName: Object.keys(ChecklistItemCategory)[2],
            categoryId: ChecklistItemCategory.Optional,
            documentId: '123/321',
            expiryDate: new Date('10/10/2023').getTime(),
            nation: 'Netherlands',
            counter: 0,
            followUp: false,
            optional: true,
          },
        },
        {
          id: '12',
          status: ChecklistItemStatus.NotDone,
          documentInfo: {
            description: 'GMDSS GOC',
            documentNumber: '456/654',
            issueDate: new Date().getTime(),
            unlimited: true,
            categoryName: Object.keys(ChecklistItemCategory)[2],
            categoryId: ChecklistItemCategory.Optional,
            documentId: '456/654',
            expiryDate: new Date('1/12/2023').getTime(),
            nation: 'Netherlands',
            counter: 0,
            followUp: false,
            optional: true,
          },
        },
        {
          id: '13',
          status: ChecklistItemStatus.NotDone,
          documentInfo: {
            description: 'Vaccination Certificate',
            documentNumber: '890/123',
            issueDate: new Date().getTime(),
            unlimited: true,
            categoryName: Object.keys(ChecklistItemCategory)[1],
            categoryId: ChecklistItemCategory['Attention Required'],
            documentId: '890/123',
            expiryDate: new Date('12/12/2023').getTime(),
            nation: 'Netherlands',
            counter: 0,
            followUp: false,
            optional: true,
          },
        },
        {
          id: '14',
          status: ChecklistItemStatus.NotDone,
          documentInfo: {
            description: 'Vaccination Certificate',
            documentNumber: '111/222',
            issueDate: new Date().getTime(),
            unlimited: true,
            categoryName: Object.keys(ChecklistItemCategory)[0],
            categoryId: ChecklistItemCategory.Mandatory,
            documentId: '111/222',
            expiryDate: null,
            nation: 'Netherlands',
            counter: 0,
            followUp: false,
            optional: true,
          },
        }
      ]
    }
  ],
});

const updateDepartureChecklistItemStatus = (id: string, checklistItemId: string, newStatus: ChecklistItemStatus) =>
  (set: SetState<DepartureChecklistState>, get: GetState<DepartureChecklistState>) => {
    const checklistToUpdate = get().checklists.find(checklist => checklist.id === id);
    const untouchedChecklists = get().checklists.filter(checklist => checklist.id !== id);

    const newCheckListItemIndex = checklistToUpdate.items.findIndex(item => item.id === checklistItemId);
    const newChecklistItem: DepartureChecklistItem = {
      ...checklistToUpdate.items.find(item => item.id === checklistItemId),
      status: newStatus,
    };

    const updatedChecklistItems = [...checklistToUpdate.items];
    updatedChecklistItems.splice(newCheckListItemIndex, 1, newChecklistItem);

    const doneItemsCount = updatedChecklistItems.filter(item => item.status === ChecklistItemStatus.Done || item.status === ChecklistItemStatus.Skipped).length;
    const newPercentage = doneItemsCount / updatedChecklistItems.length;
    const newChecklist: DepartureChecklist = {
      ...checklistToUpdate,
      percentage: newPercentage,
      items: updatedChecklistItems,
    };

    const newChecklists = [
      ...untouchedChecklists,
      newChecklist,
    ];

    set({ checklists: newChecklists })

    return newChecklist;
  }

const createDepartureChecklistActions = (
  set: SetState<DepartureChecklistState>,
  get: GetState<DepartureChecklistState>,
) => ({
  updateDepartureChecklistItemStatus: (id: string, checklistItemId: string, newStatus: ChecklistItemStatus) => updateDepartureChecklistItemStatus(id, checklistItemId, newStatus)(set, get),
});

export const useDepartureChecklistStore = create<DepartureChecklistState>(
  persist(
    (set, get) => ({
      ...createDepartureChecklistStore(set, get),
      ...createDepartureChecklistActions(set, get),
    }),
    {
      name: LOCAL_STORAGE_DEPARTURE_CHECKLIST_DATA,
      getStorage: () => localDataSource,
    },
  ),
);
