
import React from "react";
import { Flex, Icon, Pressable, Text } from "native-base";

interface HiddenActionButtonProps {
  onPress: () => void;
  text?: string;
  icon: any;
  bgColor?: string;
}

export const HiddenActionButton = ({ bgColor, icon, text, onPress }: HiddenActionButtonProps) => {
  return (
    <Pressable
      px={1}
      minW={16}
      bg={bgColor}
      justifyContent="center"
      onPress={onPress}
      _pressed={{ opacity: 0.5 }}
    >
      <Flex justifyContent="center" alignItems="center">
        <Icon as={icon} color="white" />
        {text && <Text mt={1} fontSize="xs" textAlign="center" color="white" bold>{text}</Text>}
      </Flex>
    </Pressable>
  );
};