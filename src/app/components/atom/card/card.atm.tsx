import { Flex, Pressable } from "native-base";
import React from "react";
import { TouchableHighlight, TouchableOpacity } from "react-native";

interface CardProps {
  onClick?: () => void;
  children: React.ReactNode;
}

export const Card = ({ onClick, children }: CardProps) => {
  return (
    <Pressable disabled={!onClick} onPress={onClick}>
      <Flex bgColor="white" rounded="lg" p={4} shadow={2}>
        {children}
      </Flex>
    </Pressable>
  );
};