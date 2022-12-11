import React, { useCallback, useState } from "react";
import { Box, Fab, FlatList, Flex, HStack, Icon, Pressable, Text, VStack } from "native-base";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../../App";
import { Card, ConfirmationModal, PersonalChecklistCard, PreDepartureCard, TitleAndSubtitle } from "../../components";
import { PersonalChecklist } from "../../providers";
import { NewPersonalChecklistModal } from "./components/new-personal-checklist-modal.component";
import { AntDesign } from '@expo/vector-icons';
import { useIsFocused } from "@react-navigation/native";
import { SwipeListView } from "react-native-swipe-list-view";
import { MaterialIcons } from '@expo/vector-icons';
import { useDeletePersonalChecklist, useGetDepartureChecklists, useGetPersonalChecklists } from "../../domain";
import { DepartureChecklist } from "../../model";

export const ChecklistPage = ({ route, navigation }: NativeStackScreenProps<RootStackParamList, 'Checklist'>) => {
  const isFocused = useIsFocused();
  const { data: personalChecklists } = useGetPersonalChecklists();
  const { data: departureChecklists } = useGetDepartureChecklists();
  const { deletePersonalChecklist } = useDeletePersonalChecklist({
    onSuccess: () => {
      closeDeleteModal();
    },
  });

  const [selectedPersonalChecklist, setSelectedPersonalChecklist] = useState(undefined);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isPersonalChecklistModalOpen, setIsPersonalChecklistModalOpen] = useState(false);

  const handleOpenPersonalChecklistModal = () => setIsPersonalChecklistModalOpen(true);
  const handleClosePersonalChecklistModal = () => setIsPersonalChecklistModalOpen(false);

  const handlePersonalChecklistCardClick = (checklistId: string) => () => {
    navigation.navigate('PersonalChecklist', { checklistId });
  };

  const handleDepartureChecklistCardClick = (checklistId: string) => () => {
    navigation.navigate('PreDepartureChecklist', { checklistId });
  };

  const renderDepartureChecklist = ({ item }: { item: DepartureChecklist }) => {
    return (
      <Box p={1}>
        <PreDepartureCard
          departureChecklist={item}
          onClick={handleDepartureChecklistCardClick(item.id)}
        />
      </Box>
    );
  };

  const renderPersonalChecklistItem = ({ item }: { item: PersonalChecklist }) => {
    return (
      <Box p={1}>
        <PersonalChecklistCard
          personalChecklist={item}
          onClick={handlePersonalChecklistCardClick(item.id)}
        />
      </Box>
    );
  };

  const renderHiddenItem = useCallback(({
    item,
    index
  }) => {
    const deleteRow = () => {
      setSelectedPersonalChecklist(item);
      openDeleteModal();
    };

    return (
      <Flex flex={1} p={1}>
        <HStack flex={1} bgColor="red.500" borderRadius="xl">
          <Pressable
            px={8}
            ml="auto"
            bg="red.500"
            justifyContent="center"
            onPress={deleteRow}
            _pressed={{
              opacity: 0.5
            }}
            borderRadius="xl"
          >
            <Flex justifyContent="center" alignItems="center">
              <Icon as={<MaterialIcons name="delete" />} color="white" />
              <Text mt={1} textAlign="center" color="white" bold>delete</Text>
            </Flex>
          </Pressable>
        </HStack>
      </Flex>
    );
  }, []);

  const closeDeleteModal = () => setIsDeleteModalOpen(false);
  const openDeleteModal = () => setIsDeleteModalOpen(true);

  const handleDeleteChecklist = () => {
    deletePersonalChecklist(selectedPersonalChecklist.id);
  } ;

  return (
    <Flex p={2} mt={2} flex={1}>
      <VStack space={4} flex={1}>
        <TitleAndSubtitle
          title="Pre-Departure Documents List"
          subtitle="List of all required documents for your upcoming assignment"
        />

        <Flex flex={1}>
          <FlatList
            flex={1}
            data={departureChecklists}
            renderItem={renderDepartureChecklist}
          />
        </Flex>

        <TitleAndSubtitle
          title="My Checklists"
          subtitle="Create your own personal checklist"
        />

        <Flex flex={1}>
          <SwipeListView
            data={personalChecklists}
            renderItem={renderPersonalChecklistItem}
            renderHiddenItem={renderHiddenItem}
            disableRightSwipe
            rightOpenValue={-95}
          />
        </Flex>
      </VStack>

      {isFocused &&
        <Fab
          position="absolute"
          onPress={handleOpenPersonalChecklistModal}
          size="sm"
          renderInPortal={false}
          icon={
            <Icon
              color="white"
              as={<AntDesign name="plus" />}
              size="sm"
            />
          }
        />
      }

      <NewPersonalChecklistModal
        isOpen={isPersonalChecklistModalOpen}
        onClose={handleClosePersonalChecklistModal}
      />

      <ConfirmationModal
        title="Delete checklist"
        description={`Are you sure you want to delete this checklist?\nDeleting this item is an irreversible action.`}
        isOpen={isDeleteModalOpen}
        onConfirm={handleDeleteChecklist}
        onClose={closeDeleteModal}
      />
    </Flex>
  );
};