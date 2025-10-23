import React, { ReactNode } from "react";
import {
  CButton,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
} from "@coreui/react";

interface CommonModalProps {
  title: string;
  show: boolean;
  onClose: () => void;
  onSave?: () => void;
  children?: ReactNode;
  saveText?: string;
  closeText?: string;
  disableSave?: boolean;
  size?: "sm" | "lg" | "xl";
  alignment?: "top" | "center";
}

class CommonModal extends React.Component<CommonModalProps> {
  static defaultProps = {
    saveText: "Save changes",
    closeText: "Close",
    disableSave: false,
    size: "lg",
    alignment: "center",
  };

  render() {
    const {
      title,
      show,
      onClose,
      onSave,
      children,
      saveText,
      closeText,
      disableSave,
      size,
      alignment,
    } = this.props;

    return (
      <CModal alignment={alignment} visible={show} onClose={onClose} size={size}>
        <CModalHeader>
          <CModalTitle>{title}</CModalTitle>
        </CModalHeader>

        <CModalBody>{children}</CModalBody>

        <CModalFooter>
          <CButton color="secondary" variant="outline" onClick={onClose}>
            {closeText}
          </CButton>
          {onSave && (
            <CButton color="primary" onClick={onSave} disabled={disableSave}>
              {saveText}
            </CButton>
          )}
        </CModalFooter>
      </CModal>
    );
  }
}


