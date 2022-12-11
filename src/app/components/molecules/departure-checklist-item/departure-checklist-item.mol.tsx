import React from "react";
import { Flex, Text } from "native-base";
import { ChecklistItemCategory, ChecklistItemStatus, DepartureChecklistItem as DepartureChecklistItemData } from "../../../model";
import dayjs from 'dayjs';

interface DepartureChecklistItemProps {
  item: DepartureChecklistItemData;
}

export const DepartureChecklistItem = ({ item }: DepartureChecklistItemProps) => {
  const isDoneOrSkipped = item.status === ChecklistItemStatus.Done || item.status === ChecklistItemStatus.Skipped;

  return (
    <Flex bgColor="gray.100">
      <Flex p={2} flex={1} h="100%" opacity={isDoneOrSkipped ? 0.3 : 1}>
        <Text>{item.documentInfo.description}</Text>

        <Flex flexDirection="row" flex={1} h="100%">
          <Text>{item.documentInfo.nation},&nbsp;</Text>
          <Text>{item.documentInfo.documentNumber}</Text>
        </Flex>

        <Flex flexDirection="row" flex={1} h="100%" justifyContent="space-between">
          <Text color="gray.400">Issue date: {dayjs(item.documentInfo.issueDate).isValid() ? dayjs(item.documentInfo.issueDate).format('DD.MM.YYYY') : 'N/A'}</Text>
          <Text color="gray.400">Exp. date: {dayjs(item.documentInfo.expiryDate).isValid() ? dayjs(item.documentInfo.expiryDate).format('DD.MM.YYYY') : 'N/A'}</Text>
        </Flex>
      </Flex>
    </Flex>
  );
};