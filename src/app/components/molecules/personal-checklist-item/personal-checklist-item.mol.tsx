import React from "react";
import { Flex, Input, Text } from "native-base";
import { PersonalChecklistItem as PersonalChecklistItemData } from "../../../providers";
import { ChecklistItemStatus } from "../../../model";

interface PersonalChecklistItemProps {
  item: PersonalChecklistItemData;
  isFirstItem?: boolean;
  isEditMode?: boolean;
  value?: string;
  onChange?: (id: string, value: string) => void;
}

export const PersonalChecklistItem = ({ item, isEditMode, value, onChange, isFirstItem }: PersonalChecklistItemProps) => {
  return (
    <Flex bgColor="gray.100" flexDirection="row" p={4} borderTopWidth={isFirstItem ? 1 : 0} borderBottomWidth={1} borderColor="gray.200" w="100%">
      {isEditMode ? (
        <Input
          fontSize="sm"
          placeholder="New item"
          isFullWidth
          w="100%"
          h="21px"
          _focus={{
            bgColor: 'transparent',
          }}
          p={0}
          bgColor="gray.100"
          borderWidth={0}
          value={value}
          onChangeText={value => {
            onChange?.(item.id, value);
          }}
        />
      ) : (
        <Text opacity={item.status === ChecklistItemStatus.Done ? 30 : 100}>{item.name}</Text>
      )}
    </Flex>
  );
};