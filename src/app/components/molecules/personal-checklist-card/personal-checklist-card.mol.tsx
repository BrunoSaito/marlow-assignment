import { Flex, Icon, IconButton, Text } from "native-base";
import React, { useMemo } from "react";
import { Feather } from '@expo/vector-icons';
import { Card } from "../../atom";
import { PersonalChecklist } from "../../../providers";
import * as _ from 'lodash';

interface PersonalChecklistCardProps {
  personalChecklist: PersonalChecklist;
  onClick: () => void;
}

export const PersonalChecklistCard = ({ personalChecklist, onClick }: PersonalChecklistCardProps) => {
  const createdAtText = useMemo(() => {
    const date = new Date(personalChecklist?.createdAt);
    return `${date.getDate()}.${date.getMonth()}.${date.getFullYear()}`
  }, [personalChecklist?.createdAt]);

  const lastAddedItemText = useMemo(() => {
    return _.orderBy(personalChecklist.items, 'createdAt', 'desc')?.[0]?.name;
  }, [personalChecklist.items]);

  return (
    <Card onClick={onClick}>
      <Flex flexDirection="row" justifyContent="space-between" alignItems="center">
        <Flex>
          <Text fontSize="lg">
            {personalChecklist.name}
          </Text>

          <Text color="text.400">
            Date created: {createdAtText}
          </Text>

          <Text color="text.400">
            Last item added: {lastAddedItemText}
          </Text>
        </Flex>

        <IconButton
          variant="ghost"
          onPress={onClick}
          rounded="full"
          icon={
            <Icon
              as={Feather}
              name="chevron-right"
              size="md"
              color="gray.400"
              alignItems="center"
            />
          }
        />
      </Flex>
    </Card>
  );
};