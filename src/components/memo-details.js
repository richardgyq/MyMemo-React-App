import { React, useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import { useNavigate, useParams } from "react-router-dom";
import {
  useGetMemoQuery,
  useCreateMemoMutation,
  useUpdateMemoMutation,
} from "services/mymemo-api";
import { CREATE_MEMO, UPDATE_MEMO } from "constants";
import AppSpinner from "components/app-spinner";
import { usePrompt } from "services/react-router-dom-prompt-blocker";

const MemoDetails = (props) => {
  const { id: memoId } = useParams();
  const [createMemo, { isLoading: isCreating, error: errorCreate }] =
    useCreateMemoMutation();
  const [updateMemo, { isLoading: isUpdating, error: errorUpdate }] =
    useUpdateMemoMutation();

  const emptyMemo = { title: "", memo: "" };
  const {
    data: memo,
    isLoading,
    error: errorLoadingMemo,
  } = useGetMemoQuery(memoId, {
    skip: !memoId,
  });

  const navigate = useNavigate();
  const mode = memoId ? UPDATE_MEMO : CREATE_MEMO;
  const initialFormStatus = {
    validated: false,
    submitted: false,
    isDirty: false,
  };

  // local states
  const [formModel, setFormModel] = useState(emptyMemo);
  const [formStatus, setFormStatus] = useState(initialFormStatus);

  useEffect(() => {
    if (memo) {
      setFormModel(memo);
    }
  }, [memo]);

  usePrompt(
    "You've got unsaved changes. Are you sure you want to leave?",
    formStatus.isDirty
  );

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setFormModel({
      ...formModel,
      [name]: value,
    });

    setFormStatus({
      ...formStatus,
      isDirty: isMemoChanged(),
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

  const isMemoChanged = () => {
    return (
      !isLoading &&
      (formModel.title !== (memo ?? emptyMemo).title ||
        formModel.memo !== (memo ?? emptyMemo).memo)
    );
  };

  const save = () => {
    if (mode === UPDATE_MEMO) {
      if (formStatus.isDirty) {
        updateMemo(formModel);
      }
    } else if (mode === CREATE_MEMO) {
      createMemo(formModel);
    }
    setFormStatus({
      submitted: true,
      validated: false,
      isDirty: false,
    });
  };

  const goBack = () => {
    navigate(-1);
  };

  const cancel = () => {
    setFormStatus({
      ...formStatus,
      isDirty: false,
    });
    goBack();
  };

  const isBusy = isCreating || isUpdating || isLoading;
  const error = errorLoadingMemo ?? errorCreate ?? errorUpdate;

  if (!isBusy && formStatus.submitted && !error) {
    goBack();
  }

  return (
    <Container>
      {isBusy && <AppSpinner />}
      {!isBusy && formStatus.submitted && error && (
        <Alert variant="danger">
          <h4>
            Oops! {error.status} {JSON.stringify(error.data)}
          </h4>
        </Alert>
      )}
      <h5>{mode === CREATE_MEMO ? "New" : "Edit"} Memo</h5>
      <Form noValidate validated={formStatus.validated} onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Title</Form.Label>
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
        <Button type="submit" variant="info" className="me-2">
          {mode === CREATE_MEMO ? "Add" : "Update"} Memo
        </Button>
        <Button variant="outline-info" className="me-2" onClick={cancel}>
          Cancel
        </Button>
      </Form>
    </Container>
  );
};

export default MemoDetails;
