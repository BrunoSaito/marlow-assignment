import { Flex, Icon, IconButton, Text } from "native-base";
import React from "react";
import { Feather } from '@expo/vector-icons';
import { Card } from "../../atom";
import { DepartureChecklist } from "../../../model";
import CircularProgress from 'react-native-circular-progress-indicator';

interface PreDepartureCardProops {
  departureChecklist: DepartureChecklist;
  onClick: () => void;
}

export const PreDepartureCard = ({ departureChecklist, onClick }: PreDepartureCardProops) => {
  return (
    <Card onClick={onClick}>
      <Flex flexDirection="row" justifyContent="space-between" alignItems="center">
        <Flex flexDirection="row" alignItems="center">
          <CircularProgress radius={35} value={departureChecklist.percentage * 100} valueSuffix="%" />
          <Text ml={4} fontSize="lg">
            Review List
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