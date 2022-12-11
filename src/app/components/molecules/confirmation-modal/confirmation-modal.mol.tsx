import React from "react";
import { Button, Modal, Text } from "native-base";

interface ConfirmationModalProps {
  title?: string;
  description?: string;
  isLoadingButton?: boolean;
  isOpen: boolean;
  cancelText?: string;
  confirmText?: string;
  onClose: () => void;
  onConfirm?: () => void;
}

export const ConfirmationModal = ({ title, description, isLoadingButton, isOpen = false, cancelText = 'Cancel', confirmText = 'Confirm', onClose, onConfirm }: ConfirmationModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Modal.Content maxWidth="400px">
        <Modal.CloseButton />
        <Modal.Header>{title}</Modal.Header>
        <Modal.Body>
          <Text>
            {description}
          </Text>
        </Modal.Body>
        <Modal.Footer>
          <Button.Group space={2}>
            <Button variant="ghost" colorScheme="blueGray" onPress={onClose}>
              {cancelText}
            </Button>
            <Button onPress={onConfirm}>
              {confirmText}
            </Button>
          </Button.Group>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
};
