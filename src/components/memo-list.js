import { React, useState } from "react";
import { Link } from "react-router-dom";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import Modal from "react-bootstrap/Modal";
import moment from "moment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-regular-svg-icons";
import { faStar as fasStar } from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "store/user-slice";
import {
  useGetMemosQuery,
  useDeleteMemoMutation,
  useToggleStarMutation,
} from "services/mymemo-api";
import AppSpinner from "components/app-spinner";

const MemoList = (props) => {
  const userSlice = useSelector(selectCurrentUser);
  const { data: memoList, isLoading } = useGetMemosQuery(undefined, {
    skip: !userSlice?.isLoggedIn,
  });
  const [deleteMemo, { isLoading: isDeleting }] = useDeleteMemoMutation();
  const [toggleStar, { isLoading: isUpdating }] = useToggleStarMutation();
  const [memoToDelete, setMemoToDelete] = useState({});

  const deleteMemoById = (id) => {
    closeDeleteConfirmation();
    deleteMemo(id);
  };

  const closeDeleteConfirmation = () => {
    setMemoToDelete({});
  };

  const toggleStarById = (id) => {
    toggleStar(id);
  };

  if (!userSlice?.isLoggedIn) {
    return (
      <Alert variant="warning">
        You are not logged in. Please <Link to="/login">login</Link> to see your
        memos.
      </Alert>
    );
  }

  return (
    <Container>
      {(isLoading || isDeleting || isUpdating) && <AppSpinner />}
      <Container>
        <Link to="/memos/create">
          <Button varient="outline-info" className="mb-3">
            Add Memo
          </Button>
        </Link>
        {memoList &&
          memoList.map((memo) => {
            return (
              <Card key={memo.id} className="mb-3">
                <Card.Body>
                  <Container>
                    <Card.Title>
                      <FontAwesomeIcon
                        icon={memo.favourite ? fasStar : faStar}
                        title="Toggle Star"
                        onClick={() => toggleStarById(memo.id)}
                      ></FontAwesomeIcon>
                      {memo.title}
                    </Card.Title>
                    <Card.Text>
                      <b>Memo:</b>
                      {memo.memo}
                    </Card.Text>
                    <Card.Text>
                      Date created:{" "}
                      {moment(memo.created).format("Do MMMM YYYY")}
                    </Card.Text>
                  </Container>
                  <hr />
                  <Container>
                    <Link
                      to={`/memos/${memo.id}`}
                      state={{ currentMemo: memo }}
                    >
                      <Button variant="outline-info" className="me-2">
                        Edit
                      </Button>
                    </Link>
                    <Button
                      variant="outline-danger"
                      onClick={() => setMemoToDelete(memo)}
                    >
                      Delete
                    </Button>
                  </Container>
                </Card.Body>
              </Card>
            );
          })}
      </Container>

      <Modal
        show={!!memoToDelete.id}
        onHide={closeDeleteConfirmation}
        backdrop="static"
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          This memo will be deleted:
          <p>{memoToDelete.title}</p>
          Continue?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeDeleteConfirmation}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={() => deleteMemoById(memoToDelete.id)}
          >
            OK
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default MemoList;
