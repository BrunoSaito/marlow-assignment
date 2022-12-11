import React, { useCallback, useMemo } from "react";
import { Box, Flex, Heading, SectionList } from "native-base";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../../App";
import { useGetDepartureChecklistById, useUpdateDepartureChecklistItemStatus } from "../../domain";
import { ChecklistItemCategory, ChecklistItemStatus, DepartureChecklistItem as DepartureChecklistItemData } from "../../model";
import { DepartureChecklistItem } from "../../components/molecules/departure-checklist-item";
import { HiddenActionButton } from "../../components";
import { SwipeRow } from "react-native-swipe-list-view";
import { AntDesign, FontAwesome } from '@expo/vector-icons';
import _ from "lodash";

export const PreDepartureChecklistPage = ({ route, navigation }: NativeStackScreenProps<RootStackParamList, 'PreDepartureChecklist'>) => {
  const { checklistId } = route.params;

  const { data: checklist } = useGetDepartureChecklistById(checklistId);
  const { updateDepartureChecklistItemStatus } = useUpdateDepartureChecklistItemStatus();

  const sectionData = useMemo(() => {
    const doneItems = {
      'Done': checklist?.items.filter(item => item.status === ChecklistItemStatus.Done)
    };
    const skippedItems = {
      'Skipped': checklist?.items.filter(item => item.status === ChecklistItemStatus.Skipped)
    };
    const pendingItems = {
      'Pending': checklist?.items.filter(item => item.status === ChecklistItemStatus.Pending)
    };
    const notDoneItems = checklist?.items.filter(item => item.status === ChecklistItemStatus.NotDone);
    const groupedItemsByCategoryId = _.groupBy(notDoneItems, 'documentInfo.categoryName');

    const groupedItemsByCategoryIdAndStatus = {
      ...pendingItems,
      ...groupedItemsByCategoryId,
      ...doneItems,
      ...skippedItems,
    }

    return Object.keys(groupedItemsByCategoryIdAndStatus).map(categoryId => ({
      title: categoryId,
      data: groupedItemsByCategoryIdAndStatus[categoryId] || [],
    }));
  }, [checklist]);

  const renderSectionHeader = ({ section: { title } }) => {
    return (
      <>
        <Box h="1px" bgColor="gray.400" />
        <Box bgColor="gray.200" px={2}>
          <Heading fontSize="xl" mt="8" pb="4">
            {title}
          </Heading>
        </Box>
        <Box h="1px" bgColor="gray.400" />
      </>
    );
  };

  const renderHiddenItem = useCallback(({
    item,
    index
  }: { item: DepartureChecklistItemData, index: number }) => {
    const moveToDone = () => {
      updateDepartureChecklistItemStatus({ id: checklistId, checklistItemId: item.id, newStatus: ChecklistItemStatus.Done });
    };

    const moveToSkip = () => {
      updateDepartureChecklistItemStatus({ id: checklistId, checklistItemId: item.id, newStatus: ChecklistItemStatus.Skipped });
    };

    const moveToNotDone = () => {
      updateDepartureChecklistItemStatus({ id: checklistId, checklistItemId: item.id, newStatus: ChecklistItemStatus.NotDone });
    };

    const moveToSubmitted = () => {
      updateDepartureChecklistItemStatus({ id: checklistId, checklistItemId: item.id, newStatus: ChecklistItemStatus.Pending });
    };

    const shouldRenderDoneAndSkippActions = item.documentInfo.categoryId === ChecklistItemCategory.Optional && item.status === ChecklistItemStatus.NotDone;
    const shouldRenderOnlyDoneAction = item.documentInfo.categoryId === ChecklistItemCategory.Mandatory && item.status === ChecklistItemStatus.NotDone;
    const shouldRenderOnlySubmittedAction = item.documentInfo.categoryId === ChecklistItemCategory["Attention Required"] && item.status === ChecklistItemStatus.NotDone;
    const shouldRenderUncheckAction = item.status === ChecklistItemStatus.Done || item.status === ChecklistItemStatus.Skipped;

    return (
      <Flex flexDirection="row" justifyContent="flex-end" h="100%" flex={1}>
        {shouldRenderOnlySubmittedAction && (
          <HiddenActionButton
            bgColor="darkBlue.700"
            onPress={moveToSubmitted}
            icon={<AntDesign name="checkcircleo" />}
            text="Submitted"
          />
        )}
        {shouldRenderOnlyDoneAction && (
          <HiddenActionButton
            bgColor="green.500"
            onPress={moveToDone}
            icon={<AntDesign name="checkcircleo" />}
            text="Done"
          />
        )}
        {shouldRenderDoneAndSkippActions && (
          <>
            <HiddenActionButton
              bgColor="green.500"
              onPress={moveToDone}
              icon={<AntDesign name="checkcircleo" />}
              text="Done"
            />
            <HiddenActionButton
              bgColor="darkBlue.700"
              onPress={moveToSkip}
              icon={<AntDesign name="minuscircleo" />}
              text="Skip"
            />
          </>
        )}
        {shouldRenderUncheckAction && (
          <HiddenActionButton
            bgColor="gray.500"
            onPress={moveToNotDone}
            icon={<FontAwesome name="circle-thin" />}
            text="Uncheck"
          />
        )}
      </Flex>
    );
  }, [checklistId]);

  const renderItem = ({ item, index }: { item: DepartureChecklistItemData, index: number }) => {
    const containsTwoActions = item.documentInfo.categoryId === ChecklistItemCategory.Optional && item.status === ChecklistItemStatus.NotDone;
    const noAction = item.status === ChecklistItemStatus.Pending;

    const rightOpenValue = containsTwoActions ? -130 : -80;

    return (
      <SwipeRow
        disableRightSwipe
        disableLeftSwipe={noAction}
        key={item.id}
        rightOpenValue={rightOpenValue}
      >
        {renderHiddenItem({ item, index })}
        <DepartureChecklistItem item={item} />
      </SwipeRow>
    );
  };

  return (
    <Flex flex={1} safeAreaBottom>
      {!!sectionData && (
        <SectionList
          flex={1}
          sections={sectionData}
          renderSectionHeader={renderSectionHeader}
          renderItem={renderItem}
          ItemSeparatorComponent={() => <Box h="1px" bgColor="gray.400" />}
        />
      )}
    </Flex>
  );
};