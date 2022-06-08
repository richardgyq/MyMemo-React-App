import { React, useState } from "react";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import { Link, useLocation } from "react-router-dom";
import {
  useCreateMemoMutation,
  useUpdateMemoMutation,
} from "services/mymemo-api";
import { CREATE_MEMO, UPDATE_MEMO } from "constants";
import AppSpinner from "components/app-spinner";

const MemoDetails = (props) => {
  const [createMemo, { isLoading: isCreating }] = useCreateMemoMutation();
  const [updateMemo, { isLoading: isUpdating }] = useUpdateMemoMutation();

  const location = useLocation();
  const emptyFormData = { title: "", memo: "" };
  const initialFormStatus = {
    validated: false,
    submitted: false,
    error: "",
  };
  const initialFormModel =
    location.state && location.state.currentMemo
      ? location.state.currentMemo
      : emptyFormData;
  // local states
  const [formModel, setFormModel] = useState(initialFormModel);
  const [formStatus, setFormStatus] = useState(initialFormStatus);

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setFormModel({
      ...formModel,
      [name]: value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    event.stopPropagation();

    const form = event.currentTarget;
    const isFormValid = form.checkValidity();
    setFormStatus({
        ...formStatus,
        validated: true,
    });
    if (isFormValid) {
      save();
    }
  };

  const save = () => {
    if (props.mode === UPDATE_MEMO) {
      updateMemo(formModel)
        .unwrap()
        .catch((response) => {
          const msg = response.data.error;
          setFormStatus({
            ...formStatus,
            error: msg,
          });
        });
    } else if (props.mode === CREATE_MEMO) {
      createMemo(formModel)
        .unwrap()
        .then(() => {
          setFormModel(emptyFormData);
        })
        .catch((response) => {
          const msg = response.data.error;
          setFormStatus({
            ...formStatus,
            error: msg,
          });
        });
    }
    setFormStatus({
      submitted: true,
      validated: false,
      error: "",
    });
  };

  const isBusy = isCreating || isUpdating;
  return (
    <Container>
      {isBusy && <AppSpinner />}
      {!isBusy && formStatus.submitted && formStatus.error && (
        <Alert variant="danger">
          <h4>Oops! {formStatus.error}</h4>
        </Alert>
      )}
      {!isBusy && formStatus.submitted && !formStatus.error && (
        <Alert variant="info">
          <h4>
            Memo {props.mode === CREATE_MEMO ? "created" : "updated"}{" "}
            successfully.
          </h4>
          <Link to="/">Back to list</Link>
        </Alert>
      )}
      <Form noValidate validated={formStatus.validated} onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>
            {props.mode === CREATE_MEMO ? "Create" : "Edit"} Memo
          </Form.Label>
          <Form.Control
            type="text"
            required
            placeholder="Enter memo title"
            value={formModel.title}
            name="title"
            onChange={handleFieldChange}
          ></Form.Control>
          <Form.Control.Feedback type="invalid">
            Please enter a title.
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Details</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="Enter memo text"
            value={formModel.memo}
            name="memo"
            onChange={handleFieldChange}
          ></Form.Control>
        </Form.Group>
        <Button type="submit" variant="info">
          {props.mode === CREATE_MEMO ? "Create" : "Update"} Memo
        </Button>
      </Form>
    </Container>
  );
};

export default MemoDetails;
