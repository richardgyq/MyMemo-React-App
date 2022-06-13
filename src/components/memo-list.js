import moment from "moment";
import { React, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Row,
  Col,
  Form,
  InputGroup,
  Container,
  Card,
  Button,
  Alert,
  Modal,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-regular-svg-icons";
import {
  faStar as fasStar,
  faSearch,
  faSort,
  faXmark,
  faArrowUp,
  faArrowDown,
} from "@fortawesome/free-solid-svg-icons";
import { useSelector, useDispatch } from "react-redux";
import { selectCurrentUser } from "store/user-slice";
import {
  actionFilterTextChanged,
  actionToggleSortDirection,
  actionSortFieldSelected,
  actionToggleFavourites,
  selectListOptions,
} from "store/memo-list-options-slice";
import {
  useGetMemosQuery,
  useDeleteMemoMutation,
  useToggleStarMutation,
} from "services/mymemo-api";
import AppSpinner from "components/app-spinner";

const MemoList = (props) => {
  const dispatch = useDispatch();
  const userSlice = useSelector(selectCurrentUser);
  const listOptions = useSelector(selectListOptions);
  const { data: memoList = [], isLoading } = useGetMemosQuery(undefined, {
    skip: !userSlice?.isLoggedIn,
  });
  const [deleteMemo, { isLoading: isDeleting }] = useDeleteMemoMutation();
  const [toggleStar, { isLoading: isUpdating }] = useToggleStarMutation();
  const [memoToDelete, setMemoToDelete] = useState({});

  const sortedMemos = useMemo(() => {
    let result = memoList.slice();
    const lowerCaseText = listOptions.filterText?.toLowerCase()?.trim();
    if (lowerCaseText) {
      result = result.filter((item) => {
        return (
          item.title.toLowerCase().includes(lowerCaseText) ||
          item.memo.toLowerCase().includes(lowerCaseText)
        );
      });
    }

    if (listOptions.showFavouritesOnly) {
      result = result.filter((item) => item.favourite);
    }

    result = result.sort((a, b) => {
      const field = listOptions.sorting.by;
      if (["title", "memo"].includes(field)) {
        return listOptions.sorting.desc
          ? b[field].localeCompare(a[field])
          : a[field].localeCompare(b[field]);
      }
      if (a[field] === b[field]) {
        return 0;
      }
      if (listOptions.sorting.desc) {
        return a[field] < b[field] ? 1 : -1;
      }
      return a[field] > b[field] ? 1 : -1;
    });

    return result;
  }, [memoList, listOptions]);

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

  const toggleStarFilter = () => {
    dispatch(actionToggleFavourites());
  };

  const handleFilterTextChange = (e) => {
    const { value } = e.target;
    dispatch(actionFilterTextChanged(value));
  };

  const clearFilterText = () => {
    dispatch(actionFilterTextChanged(""));
  };

  const toggleSortDirection = () => {
    dispatch(actionToggleSortDirection());
  };

  const handleSortFieldChange = (e) => {
    const { value } = e.target;
    dispatch(actionSortFieldSelected(value));
  };

  const MemoCard = ({ memo }) => {
    const borderType = memo.favourite ? "primary" : "secondary";
    return (
      <Card key={memo.id} className="mb-3" border={borderType}>
        <Card.Body>
          <Card.Title>
            <FontAwesomeIcon
              icon={memo.favourite ? fasStar : faStar}
              title="Toggle Star"
              onClick={() => toggleStarById(memo.id)}
            ></FontAwesomeIcon>
            &nbsp;{memo.title}
          </Card.Title>
          <Card.Text>
            <b>Memo: </b>
            {memo.memo}
          </Card.Text>
          <Card.Text>
            Date created: {moment(memo.created).format("Do MMMM YYYY")}
          </Card.Text>
        </Card.Body>
        <Card.Footer>
          <Link to={`/memos/${memo.id}`} state={{ currentMemo: memo }}>
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
        </Card.Footer>
      </Card>
    );
  };

  const MemoDeleteConfirmationModal = () => {
    return (
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
    );
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
      <Row>
        <Link to="/memos/create">
          <Button varient="outline-info" className="mb-3">
            Add Memo
          </Button>
        </Link>
      </Row>
      <Row className="align-items-center justify-content-md-center">
        <Col sm="auto">
          <Form.Check
            type="switch"
            id="switch_starred"
            label="Starred"
            checked={listOptions.showFavouritesOnly}
            onChange={toggleStarFilter}
          />
        </Col>
        <Col sm md={3}>
          <InputGroup className="my-2">
            <InputGroup.Text>
              <FontAwesomeIcon icon={faSearch} />
            </InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Search here..."
              value={listOptions.filterText}
              onChange={handleFilterTextChange}
            />
            {listOptions.filterText && (
              <InputGroup.Text onClick={clearFilterText}>
                <FontAwesomeIcon icon={faXmark} />
              </InputGroup.Text>
            )}
          </InputGroup>
        </Col>
        <Col sm md={3}>
          <InputGroup className="my-2">
            <InputGroup.Text>
              <FontAwesomeIcon icon={faSort} />
            </InputGroup.Text>
            <Form.Select
              value={listOptions.sorting.by}
              onChange={handleSortFieldChange}
            >
              <option value="created">Date</option>
              <option value="title">Title</option>
              <option value="memo">Memo</option>
            </Form.Select>
            <InputGroup.Text onClick={toggleSortDirection}>
              <FontAwesomeIcon
                icon={listOptions.sorting.desc ? faArrowDown : faArrowUp}
              />
            </InputGroup.Text>
          </InputGroup>
        </Col>
      </Row>
      <Row>
        {sortedMemos.map((memo) => (
          <MemoCard key={memo.id} memo={memo} />
        ))}
      </Row>
      <MemoDeleteConfirmationModal />
    </Container>
  );
};

export default MemoList;
