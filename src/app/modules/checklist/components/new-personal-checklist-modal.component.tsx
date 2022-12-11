import React, { useCallback, useEffect, useState } from "react";
import { Box, Button, FormControl, Input, Modal } from "native-base";
import { useAddPersonalChecklist } from "../../../domain";

interface NewPersonalChecklistModalProps {
  isOpen?: boolean;
  onClose: () => void;
}

export const NewPersonalChecklistModal = ({ isOpen, onClose }: NewPersonalChecklistModalProps) => {
  const { addPersonalChecklist } = useAddPersonalChecklist();

  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setFormData({});
    setErrors({});
  }, [isOpen]);

  const validate = () => {
    if (!formData.name) {
      setErrors({
        ...errors,
        name: 'List name is required'
      });
      return false;
    }
    
    return true;
  };

  const handleAddPersonalChecklist = useCallback(() => {
    // addPersonalChecklist({
    //   name: formData.name,
    // });
    addPersonalChecklist(formData.name)
    onClose?.();
  }, [formData]);

  const handleSubmit = () => {
    if (validate()) {
      handleAddPersonalChecklist();
    } else {

    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Modal.Content maxH="212">
        <Modal.CloseButton />
        <Modal.Header>New Personal Checklist</Modal.Header>
        <Modal.Body h="200px">
          <Box height="200px">
            <FormControl isRequired isInvalid={'name' in errors}>
              <Input
                fontSize="lg"
                placeholder="Insert list's title"
                isFullWidth
                _focus={{
                  bgColor: 'white',
                }}
                isRequired
                value={formData.name ?? ''}
                onChangeText={value => setFormData({ ...formData, name: value })}
              />
              {'name' in errors &&
                <FormControl.ErrorMessage _text={{
                  fontSize: 'xs',
                }}>
                  {errors.name}
                </FormControl.ErrorMessage>
              }
            </FormControl>
          </Box>
        </Modal.Body>
        <Modal.Footer>
          <Button.Group space={2}>
            <Button
              variant="ghost"
              colorScheme="blueGray"
              onPress={onClose}>
              Cancel
            </Button>
            <Button onPress={handleSubmit}>Add</Button>
          </Button.Group>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
};