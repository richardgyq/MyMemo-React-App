import { React, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import Modal from 'react-bootstrap/Modal'
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-regular-svg-icons';
import { faStar as fasStar } from '@fortawesome/free-solid-svg-icons';
import { useSelector, useDispatch } from 'react-redux';
import { thunkLoadMemos, thunkDeleteMemo, thunkToggleStar } from 'store/memos';
import AppSpinner from 'components/app-spinner';


const MemoList = props => {
    const { memoList, isProcessing } = useSelector(state => state.sliceMemos);
    const { user } = useSelector(state => state.sliceUser);
    const [memoToDelete, setMemoToDelete] = useState({});

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(thunkLoadMemos());
    }, [dispatch, user]);

    const deleteMemo = (id) => {
        closeDeleteConfirmation();
        dispatch(thunkDeleteMemo(id));
    };

    const closeDeleteConfirmation = () => {
        setMemoToDelete({});
    }

    const toggleStar = (id) => {
        dispatch(thunkToggleStar(id));
    };

    if (!user.token) {
        return (
            <Alert variant='warning'>
                You are not logged in. Please <Link to='/login'>login</Link> to see your memos.
            </Alert>
        );
    }

    return (
        <Container>
            { isProcessing && (
                <AppSpinner />
            )}
            <Container>
                <Link to='/memos/create'>
                    <Button varient='outline-info' className='mb-3'>
                        Add Memo
                    </Button>
                </Link>
                {memoList.map((memo) => {
                    return (
                        <Card key={memo.id} className='mb-3'>
                            <Card.Body>
                                <Container>
                                    <Card.Title>
                                        <FontAwesomeIcon icon={memo.favourite ? fasStar : faStar}
                                            title='Toggle Star' onClick={()=>toggleStar(memo.id)}>
                                        </FontAwesomeIcon>
                                        {memo.title}
                                    </Card.Title>
                                    <Card.Text><b>Memo:</b>{memo.memo}</Card.Text>
                                    <Card.Text>Date created: {moment(memo.created).format('Do MMMM YYYY')}</Card.Text>
                                </Container>
                                <Container>
                                    <Link to={`/memos/${memo.id}`} state={{ currentMemo: memo }}>
                                        <Button variant='outline-info' className='me-2'>Edit</Button>
                                    </Link>
                                    <Button variant='outline-danger' onClick={()=>setMemoToDelete(memo)}>
                                        Delete
                                    </Button>
                                </Container>
                            </Card.Body>
                        </Card>
                    );
                })}
            </Container>

            <Modal show={!!memoToDelete.id} onHide={closeDeleteConfirmation} backdrop="static">
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
                    <Button variant="primary" onClick={()=>deleteMemo(memoToDelete.id)}>
                        OK
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
}

export default MemoList;
