import { Flex, Heading, Text } from "native-base";
import React from "react";

interface TitleAndSubtitleProps {
  title: string;
  subtitle?: string;
}

export const TitleAndSubtitle = ({ title, subtitle }: TitleAndSubtitleProps) => {
  return (
    <Flex>
      <Heading fontSize="md">{title}</Heading>
      {subtitle && (
        <Text italic>{subtitle}</Text>
      )}
    </Flex>
  );
};