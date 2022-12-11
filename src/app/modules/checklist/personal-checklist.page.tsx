import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button, Flex, Heading, Input } from "native-base";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../../App";
import { useDeletePersonalChecklistItem, useGetPersonalChecklistById, useUpdateChecklistItemStatus, useUpdatePersonalChecklistItems } from "../../domain";
import { ConfirmationModal, HiddenActionButton, PersonalChecklistItem } from "../../components";
import { ChecklistItemStatus } from "../../model";
import uuid from 'react-native-uuid';
import _ from "lodash";
import { PersonalChecklistItem as PersonalChecklistItemModel } from "../../providers";
import { SwipeRow } from 'react-native-swipe-list-view';
import { MaterialIcons } from '@expo/vector-icons';

export const PersonalChecklistPage = ({ route, navigation }: NativeStackScreenProps<RootStackParamList, 'PersonalChecklist'>) => {
  const { checklistId } = route.params;

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(undefined);

  const [isEditMode, setIsEditMode] = useState(false);
  const [newItems, setNewItems] = useState<Partial<PersonalChecklistItemModel>[]>([]);
  const [newItem, setNewItem] = useState('');
  const rowsRef = useRef([]);
  const newItemInput = useRef(null);

  const { data: checklist } = useGetPersonalChecklistById(checklistId);
  const { updatePersonalChecklistItems } = useUpdatePersonalChecklistItems({
    onSuccess: () => {
      setNewItem('');
      toggleEditMode();
    }
  });

  const { deletePersonalChecklistItem } = useDeletePersonalChecklistItem({
    onSuccess: () => {
      closeDeleteModal();
    },
  });
  const { updatePersonalChecklistItemStatus } = useUpdateChecklistItemStatus();

  const toggleEditMode = () => setIsEditMode(!isEditMode);

  const doneItems = useMemo(() => checklist?.items?.filter(item => item.status === ChecklistItemStatus.Done), [checklist])
  const notDoneItems = useMemo(() => checklist?.items?.filter(item => item.status === ChecklistItemStatus.NotDone), [checklist])

  const handleSave = useCallback(() => {
    const updatedItems = [
      ...newItems,
    ];

    !!newItem && updatedItems.push({
      id: uuid.v4().toString(),
      name: newItem,
    });

    updatePersonalChecklistItems({ id: checklistId, checklistItems: updatedItems });
  }, [newItems, newItem]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button rounded="full" minW={16} onPress={isEditMode ? handleSave : toggleEditMode}>{isEditMode ? 'Save' : 'Edit'}</Button>
      ),
    });
  }, [navigation, isEditMode, handleSave]);

  useEffect(() => {
    setNewItems(checklist?.items ?? []);
  }, [checklist?.items]);

  const handleSubmitEditing = useCallback(() => {
    if (newItem !== '') {
      setNewItems([
        ...newItems,
        {
          id: uuid.v4().toString(),
          name: newItem,
        },
      ]);
      setNewItem('');
      newItemInput?.current?.focus();
    }
  }, [newItems, newItem]);

  const renderItems = ({ item, index }) => {
    return (
      <PersonalChecklistItem
        item={item}
        isFirstItem={index === 0}
        isEditMode={isEditMode}
        value={newItems?.find?.(newItem => newItem.id === item.id)?.name}
        onChange={(id, value) => {
          const updatedItemIndex = newItems.findIndex(newItem => newItem.id === id);
          const updatedItems = [...newItems];
          updatedItems[updatedItemIndex] = {
            ...item,
            id,
            name: value,
          };
  
          setNewItems(updatedItems);
        }}
      />
    );
  };

  const renderHiddenItem = useCallback(({
    item,
    index
  }) => {
    const deleteRow = () => {
      setSelectedItem(item);
      openDeleteModal();
    };

    const moveToDone = () => {
      updatePersonalChecklistItemStatus({ id: checklistId, checklistItemId: item.id, newStatus: ChecklistItemStatus.Done });
    };

    const moveToNotDone = () => {
      updatePersonalChecklistItemStatus({ id: checklistId, checklistItemId: item.id, newStatus: ChecklistItemStatus.NotDone });
    };

    return (
      <Flex flexDirection="row" justifyContent="flex-end" h="100%" flex={1}>
        <HiddenActionButton
          bgColor="red.500"
          onPress={deleteRow}
          icon={<MaterialIcons name="delete" />}
        />
        {item.status === ChecklistItemStatus.Done && (
          <HiddenActionButton
            bgColor="gray.500"
            onPress={moveToNotDone}
            icon={<MaterialIcons name="replay" />}
          />
        )}
        {item.status === ChecklistItemStatus.NotDone && (
          <HiddenActionButton
            bgColor="green.500"
            onPress={moveToDone}
            icon={<MaterialIcons name="check" />}
          />
        )}
      </Flex>
    );
  }, [checklistId]);

  const handleRowOpened = (indexToKeepOpen: number) => () => {
    notDoneItems.forEach((_, index) => {
      if (index !== indexToKeepOpen) {
        rowsRef.current?.[index].closeRow();
      }
    });
  };

  const closeDeleteModal = () => setIsDeleteModalOpen(false);
  const openDeleteModal = () => setIsDeleteModalOpen(true);

  const handleDeleteChecklistItem = () => {
    deletePersonalChecklistItem({ id: checklistId, checklistItemIdToDelete: selectedItem.id });
  } ;

  return (
    <Flex>
      <Heading px={4} p={2} mb={4} fontSize="2xl">{checklist?.name}</Heading>

      <Heading mb={2} px={4} fontSize="xl">To-do</Heading>

      {notDoneItems?.map((item, index) => (
        <SwipeRow
          disableRightSwipe
          key={`${item.id}-${index}`}
          ref={ref => rowsRef.current[index] = ref}
          rightOpenValue={-130}
          onRowOpen={handleRowOpened(index)}
        >
          {renderHiddenItem({ item, index })}
          {renderItems({ item, index })}
        </SwipeRow>
      ))}
      {newItems?.filter(newItem => !_.map(checklist?.items, 'id').includes(newItem.id))?.map(item => (
        <Input
          fontSize="sm"
          p={4}
          bgColor="gray.100"
          placeholder="New item"
          isFullWidth
          borderWidth={0}
          value={item.name}
          onChangeText={(value) => {
            const updatedItemIndex = newItems.findIndex(newItem => newItem.id === item.id);
            const updatedItems = [...newItems];
            updatedItems[updatedItemIndex] = {
              ...item,
              id: item.id,
              name: value,
            };

            setNewItems(updatedItems);
          }}
        />
      ))}
      {isEditMode && (
        <Input
          fontSize="sm"
          p={4}
          ref={newItemInput}
          isFocused={true}
          autoFocus
          focusable
          bgColor="gray.100"
          placeholder="New item"
          isFullWidth
          borderWidth={0}
          value={newItem}
          onChangeText={setNewItem}
          onSubmitEditing={handleSubmitEditing}
        />
      )}

      <Heading mt={4}  mb={2} px={4} fontSize="xl">Completed tasks</Heading>
      {doneItems?.map((item, index) => (
        <SwipeRow
          disableRightSwipe
          key={`${item.id}-${index}`}
          ref={ref => rowsRef.current[index] = ref}
          rightOpenValue={-130}
          onRowOpen={handleRowOpened(index)}
        >
          {renderHiddenItem({ item, index })}
          {renderItems({ item, index })}
        </SwipeRow>
      ))}

      <ConfirmationModal
        title="Delete checklist item"
        description={`Are you sure you want to delete this item?\nDeleting this item is an irreversible action.`}
        isOpen={isDeleteModalOpen}
        onConfirm={handleDeleteChecklistItem}
        onClose={closeDeleteModal}
      />
    </Flex>
  );
};